package es.daw.simpsons_spring.Controllers;

import es.daw.simpsons_spring.Dto.PersonajeDTO;
import es.daw.simpsons_spring.Personajes.Personaje;
import es.daw.simpsons_spring.Repository.PersonajeRepositorio;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class SimpsonController {
    private final PersonajeRepositorio repositorio;

    //Inyeccion por constructor
    public SimpsonController(PersonajeRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    @RequestMapping("/personajes")
    public String listar(Model model) {
        List<PersonajeDTO> personajes = repositorio.findAll().stream()
                .map(p -> new PersonajeDTO(
                        (p.getNombre() + " " + p.getApellido()).trim(),
                        p.getEdad(),
                        p.getOcupacion(),
                        p.getLugar()))
                .toList();
        model.addAtributte("personajes", personajes);
        return "personajes";
    }

}
