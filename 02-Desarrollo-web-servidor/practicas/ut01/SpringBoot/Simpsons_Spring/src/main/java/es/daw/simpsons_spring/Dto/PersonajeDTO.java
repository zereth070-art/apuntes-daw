package es.daw.simpsons_spring.Dto;

public record PersonajeDTO(String nombreCompleto, int edad, String ocupacion, String lugar) {

    @Override
    public String nombreCompleto() {
        return nombreCompleto;
    }

    @Override
    public int edad() {
        return edad;
    }

    @Override
    public String ocupacion() {
        return ocupacion;
    }

    @Override
    public String lugar() {
        return lugar;
    }
}
