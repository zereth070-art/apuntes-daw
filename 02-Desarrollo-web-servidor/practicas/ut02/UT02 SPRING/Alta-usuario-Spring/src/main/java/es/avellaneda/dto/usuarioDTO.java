package es.avellaneda.dto;
import  lombok.*;

import java.util.ArrayList;
import java.util.List;

//@Data: toString, equalsAndHashCode, Getters, Setters, @RequiredArgsConstructor (constructor de argumentos real)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class usuarioDTO {


    private String nombre;
    private String email;
    private String tecnologias;
    private List<String> niveles = new ArrayList<>();
}
