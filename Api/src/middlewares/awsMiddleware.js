const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadS3Middleware = (folder) => {
    return async (req, res, next) => {
        if (req.file) {

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace(/\..+/, '');
            const name = `${formattedDate}_${req.file.originalname}`;

            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `${folder}/${name}`,
                Body: req.file.buffer
            };

            try {
                await s3Client.send(new PutObjectCommand(params));

                req.imageUrl = name;
                next();
            } catch (error) {
                console.error('Error al subir el archivo', error);
            }
        } else {
            next();
        }
    };
};

const deleteS3Middleware = async (folder, image) => {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${folder}/${image}`
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`Imagen ${key} eliminada del S3 correctamente.`);
    } catch (error) {
        console.error('Error al eliminar la imagen del S3', error);
        throw error;
    }
};

module.exports = {
    uploadAndDeleteS3Middleware: (folder) => {
        
        return async (req, res, next) => {
            await uploadS3Middleware(folder) (req, res, async () => {
                try {
                    if (req.imageUrl && req.user.image_profile) {
                        await deleteS3Middleware(folder, req.user.image_profile);
                    }
                } catch (error) {
                    console.error('Error al eliminar la imagen del S3', error);
                }
                next();
            });
        };
    },
    deleteS3Middleware,
    uploadS3Middleware,
    getS3Middleware: async (key) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
        };

        try {
            const { Body } = await s3Client.send(new GetObjectCommand(params));

            return new Promise((resolve, reject) => {
                const chunks = [];

                Body.on('data', chunk => {
                    chunks.push(chunk);
                });

                Body.on('end', () => {
                    const imageBuffer = Buffer.concat(chunks);
                    const base64Image = imageBuffer.toString('base64');
                    resolve(base64Image);
                });

                Body.on('error', (error) => {
                    console.error('Error al obtener la imagen desde S3', error);
                    reject(error);
                });
            });

        } catch (error) {
            console.error('Error al obtener la imagen desde S3', error);
            throw error;
        }
    },
};