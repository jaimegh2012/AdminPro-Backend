const getMenuFrontend = (role = 'USER_ROL') => {
    const menu = [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          submenu: [
            {titulo: 'Main', url: '/'},
            {titulo: 'Progress bar', url: 'progress'},
            {titulo: 'Graficas', url: 'grafica1'},
            {titulo: 'Promesas', url: 'promesa'},
            {titulo: 'Rxjs', url: 'rxjs'},
            {titulo: 'Perfil', url: 'perfil'},
          ]
        },
        {
          titulo: 'Mantenimientos',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            //{titulo: 'Usuarios', url: 'usuarios'},
            {titulo: 'Hospitales', url: 'hospitales'},
            {titulo: 'Medicos', url: 'medicos'},
          ]
        }
      ];

      if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({titulo: 'Usuarios', url: 'usuarios'});
      }

      return menu;
}

module.exports = {
    getMenuFrontend
}