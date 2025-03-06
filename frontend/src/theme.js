// deep sky theme
const theme = {
  container: {
    // Background moved to CSS; other styles remain
    fontFamily: 'Arial, sans-serif',
    color: '#e0f7fa', // Light cyan for text
  },
  loginSection: {
    textAlign: 'center',
    marginTop: '20px',
  },
  text: {
    //color: '#80deea', // Cyan accent
    color: '#e46e00', // Orange accent
    fontSize: '1.2em',
    marginBottom: '10px',
  },
  section: {
    background: 'rgba(0, 51, 102, 0.7)', // Deep blue with transparency
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #4fc3f7', // Light blue border
  },
  header: {
    color: '#b3e5fc', // Soft sky blue
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
  },
  card: {
    background: 'rgba(0, 102, 204, 0.5)', // Medium blue with transparency
    borderRadius: '10px',
    padding: '15px',
  },
  input: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #4fc3f7', // Light blue border
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#e0f7fa', // Light cyan
  },
  button: {
    background: '#0288d1', // Deep sky blue
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background 0.3s',
  },
  logoutButton: {
    background: '#d81b60', // Red for contrast
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  editButton: {
    background: '#4fc3f7', // Light sky blue
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  deleteButton: {
    background: '#ff1744', // Bright red
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    background: 'rgba(0, 51, 102, 0.6)', // Slightly lighter deep blue
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  form: {
    marginTop: '20px',
  },
  footer: {
    textAlign: 'center',
    color: '#b3e5fc', // Soft sky blue
    marginTop: '20px',
  },
};

export default theme;