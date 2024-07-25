import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FF6F61',
    borderRadius: 50,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#333', // Dark background
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Dark border color
    alignItems: 'center',
    paddingTop: 50,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10, // Rounded corners
    marginRight: 20, // Add right margin to separate from information
  },
  infoContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF', // White text
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
    color: '#DDD', // Light gray text
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFF', // White text
    fontSize: 15,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabText: {
    fontSize: 14, // Reduce title font size
    color: '#333', // Dark text
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12, // Reduce label font size
    color: '#333', // Dark label color
    fontWeight: '600',
  },
  indicator: {
    backgroundColor: '#333', // Dark indicator color
  },
  card: {
    marginBottom: 10,
    width: Dimensions.get('window').width - 20, // Adjust card width
    backgroundColor: '#FFF',
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center', // Center content vertically
    padding: 10,
  },
  cardContent: {
    flexDirection: 'column', // Arrange content in a column
    justifyContent: 'flex-start', // Align items to the start
  },
  cardTitle: {
    fontSize: 16, // Reduce title font size
    fontWeight: 'bold',
    color: '#333', // Dark text
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6F61',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    position: 'relative', // To position the close button relative to the content
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 5,
  },
  textArea: {
    height: 100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalDate: {
    fontSize: 14,
    marginBottom: 10,
    color: '#888',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  noNotesText: {
    fontSize: 16,
    color: '#888',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF', // White background for the search bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '95%', // Make the search bar take up most of the width
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '95%', // Make the date filter container take up most of the width
  },
  dateFilterText: {
    fontSize: 16,
    color: '#333',
  },
  closeIcon: {
    marginLeft: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default styles;
