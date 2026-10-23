package es.daw.simpsons_spring.Controllers;

import es.daw.simpsons_spring.DTOs.PersonajeDTO;
import es.daw.simpsons_spring.Model.Personaje;
import es.daw.simpsons_spring.Repository.PersonajeRepositorio;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class SimpsonController {
    private final PersonajeRepositorio repositorio;

    //Inyeccion por constructor
    public SimpsonController(PersonajeRepositorio repositorio) {
        this.repositorio = repositorio;
    }
    @GetMapping("/personajes")
    public String listar(Model model) {
        List<PersonajeDTO> personajes = repositorio.findAll().stream()
                .map(PersonajeDTO::from)
                .toList();

        model.addAttribute("personajes", personajes);
        return "personajes";
    }

}
