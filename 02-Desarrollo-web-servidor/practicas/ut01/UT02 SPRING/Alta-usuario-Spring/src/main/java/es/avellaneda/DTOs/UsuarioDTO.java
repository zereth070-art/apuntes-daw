package es.avellaneda.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class UsuarioDTO {
    @NotBlank
    @Size(min = 1, max = 50)
    String nombre;
    @Email
    String email;
    String tecnologia;
    List<String> niveles;

}
