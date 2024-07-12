import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    height: 180,
    backgroundColor: '#2c2c2c',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  cardImage: {
    width: '35%',
    height: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 12,
    color: '#999',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cardFooterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  cardIcon: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    top: 700, // Ajusta este valor según sea necesario para que el botón quede más arriba
    right: 130,
    zIndex: 10, // Asegura que el botón esté por encima de otros elementos
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos adicionales para la vista vacía
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default styles;