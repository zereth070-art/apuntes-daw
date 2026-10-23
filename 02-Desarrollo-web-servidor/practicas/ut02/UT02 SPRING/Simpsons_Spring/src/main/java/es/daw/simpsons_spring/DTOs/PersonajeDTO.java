package es.daw.simpsons_spring.DTOs;

import es.daw.simpsons_spring.Model.Personaje;

public record PersonajeDTO(
        String nombreCompleto,
        int edad,
        String ocupacion,
        String lugar
) {
    public static PersonajeDTO from(Personaje p) {
        return new PersonajeDTO(
                p.nombreCompleto(),
                p.edad(),
                p.ocupacion(),
                p.lugar()
        );
    }
}