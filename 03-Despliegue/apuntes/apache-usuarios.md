# Chuleta: usuarios y autenticación en Apache2

> Extraído de los apuntes de Despliegue. Sirve para proteger una ruta con usuario y
> contraseña usando autenticación básica de Apache.

## 1. Crear el usuario del sistema

```bash
sudo adduser --system --no-create-home usuariosy3
```

## 2. Añadir el usuario al fichero de autenticación

```bash
sudo htpasswd /etc/apache2/.passwords/.prueba.com usuariosy3
```

## 3. Verificar el contenido

```bash
sudo cat /etc/apache2/.passwords/.prueba.com
```

## 4. Reiniciar Apache

```bash
sudo systemctl restart apache2
```

## 5. Probar el acceso

Abre `http://prueba.com/usuarios2y3` y autentica con el usuario y la contraseña.

## Resumen rápido

| Paso | Comando |
| --- | --- |
| Crear usuario del sistema | `sudo adduser --system --no-create-home USUARIO` |
| Añadir a `.htpasswd` | `sudo htpasswd /etc/apache2/.passwords/.prueba.com USUARIO` |
| Verificar | `sudo cat /etc/apache2/.passwords/.prueba.com` |
| Reiniciar Apache | `sudo systemctl restart apache2` |

## Notas

- **No hace falta reiniciar Apache** al renombrar archivos (por ejemplo,
  `index.hmtl` → `index.html`).
- **Sí hay que reiniciar** al modificar los ficheros de autenticación o la configuración.
- El fichero de autenticación puede estar en `/etc/apache2/.htpasswd` o en
  `/etc/apache2/.passwords/.prueba.com`, según cómo esté configurado el *virtual host*.
- Si no hay un enlace directo a la norma, la norma no se aplica: el `.htaccess` o la
  directiva del *virtual host* tienen que permitir la autenticación.
