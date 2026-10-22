package es.daw.loginspring.service;

import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Servicio de opciones: es el que sabe que tecnologias y que niveles hay
 * disponibles para los formularios de alta.
 *
 * Spring lo crea y se lo inyecta al AltaController por constructor (no hay
 * que hacer "new OpcionesService()" en el controlador).
 *
 * Los datos son los mismos que usa la practica JakartaLogin, para que las
 * dos practicas no se contradigan.
 */
@Service
public class OpcionesService {

    private static final List<String> TECNOLOGIAS = List.of(
            "Java",
            "JavaScript",
            "TypeScript",
            "Python",
            "PHP",
            "C#",
            "Go"
    );

    private static final List<String> NIVELES = List.of(
            "Principiante",
            "Intermedio",
            "Avanzado"
    );

    public List<String> tecnologias() {
        return TECNOLOGIAS;
    }

    public List<String> niveles() {
        return NIVELES;
    }
}
