package es.daw.simpsons_spring.Model;

public record Personaje(
        String nombre,
        String apellido,
        int edad,
        String ocupacion,
        String lugar,
        boolean principal
) {
    public String nombreCompleto() {
        return apellido.isBlank() ? nombre : nombre + " " + apellido;
    }

    public boolean esMenor() {
        return edad < 18;
    }
}