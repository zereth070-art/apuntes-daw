package es.avellaneda.service;

import es.avellaneda.dto.UsuarioDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AltaService {

    private static final List<String> TECNOLOGIAS =
            List.of("Java", "Python", "JavaScript", "PHP", "C#");
    private static final List<String> NIVELES =
            List.of("Principiante", "Intermedio", "Avanzado");

    // Almacén en memoria: se pierde al reiniciar la aplicación.
    private final List<UsuarioDTO> usuarios = new ArrayList<>();

    public List<String> getTecnologias() {
        return TECNOLOGIAS;
    }

    public List<String> getNiveles() {
        return NIVELES;
    }

    public UsuarioDTO registrar(UsuarioDTO usuario) {
        usuarios.add(usuario);
        return usuario;
    }

    public List<UsuarioDTO> getUsuarios() {
        return usuarios;
    }
}
