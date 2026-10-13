package es.daw.altausuariospring.controller;

import es.daw.altausuariospring.services.AltaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class AltaController {
// ------------------- INYECTION DE DEPENDENDIAS POR PROPIEDAD ----------------------------------
    @Autowired
    private AltaService service2;
// ----------------- INYECCIÓN DE DEPENDENCIAS POR CONSTRUCTOR ---------------------------------
//  razones por las que usar inyección por constructor
// 1º Cuando Spring carga el controlador, sabe por constructor las dependencias que tiene el controlador
// 2º    No necesito Spring: En un test unitario solo basta con pasar la dependencia, por ejemplo un mock:
// AltaController c = new AltaController(mockService)
    private final AltaService service;

    // Inyección por constructor: NO hacemos new OpcionesService(), nos lo da Spring
    public AltaController(AltaService service) {
        this.service = service ;
    }

    @GetMapping("/")
    public String inicio() {
        return "index";              // → templates/index.html
    }

    @GetMapping("/alta")
    public String mostrarFormulario(Model model) {
        // 1. Añadir al modelo las listas de tecnologías y niveles
        model.addAttribute("tecnologias", service.getTecnologias());
        model.addAttribute("listaNiveles", service.getNiveles());
        // 2. Devolver el nombre de la vista
        return "formulario";         // → templates/formulario.html
    }

    @PostMapping("/alta")
    public String procesarFormulario(@RequestParam String nombre,
                                     @RequestParam String email,
                                     @RequestParam String tecnologia,
                                     @RequestParam(name = "nivel", required = false) List<String> niveles,
                                     Model model) {
        // 1. Si nombre está vacío → mensajeError + datos introducidos + listas → "formulario"
        if (nombre.isBlank()) {
            model.addAttribute("mensajeError", "El nombre es obligatorio");
            model.addAttribute("nombre", nombre);
            model.addAttribute("email", email);
            model.addAttribute("tecnologia", tecnologia);
            model.addAttribute("niveles", niveles == null ? List.of() : niveles);
            model.addAttribute("tecnologias", service.getTecnologias());
            model.addAttribute("listaNiveles", service.getNiveles());
            return "formulario";
        }

        // 2. Si no → datos al modelo → "confirmacion"
        model.addAttribute("nombre", nombre);
        model.addAttribute("email", email);
        model.addAttribute("tecnologia", tecnologia);
        model.addAttribute("niveles", niveles == null ? List.of() : niveles);
        return "confirmacion";       // → templates/confirmacion.html
    }

    // Si OpcionesService no encuentra el fichero, en vez de un 500 blanco
    // devolvemos la vista "error" con el mensaje de la excepción


}
