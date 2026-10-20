package es.avellaneda.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

//@Data: toString, equalsAndHashCode, Getters, Setters, @RequiredArgsConstructor (constructor de argumentos real)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UsuarioDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email no válido")
    private String email;

    private String tecnologia;

    private List<String> niveles = new ArrayList<>();
}
