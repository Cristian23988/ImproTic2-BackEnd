// vendor
// import axios from 'axios';

const roles = async () => {
  // const response = await axios.get('http://localhost:8080/roles');

  return [
    {
      code: 'admin',
      value: 'Administrador',
    },
    {
      code: 'leader',
      value: 'Líder',
    },
    {
      code: 'student',
      value: 'Estudiante',
    }
  ];
};

export default {
  miscQueries: {
    roles,
  }
}