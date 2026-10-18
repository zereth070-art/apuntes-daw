package es.avellaneda.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HomeController {

    // Listas fijas del formulario: el GET las deja en el modelo y el POST
    // las repite si hay que volver a pintar por un error.
    private static final List<String> TECNOLOGIAS =
            List.of("Java", "Python", "JavaScript", "PHP", "C#");
    private static final List<String> NIVELES =
            List.of("Principiante", "Intermedio", "Avanzado");

    @GetMapping("/")
    public String inicio(HttpSession session, Model model) {
        String usuario = (String) session.getAttribute("usuario"); // <- leer el usuario
        if (usuario != null) {
            model.addAttribute("usuario",usuario); // sin guardar el modelo, usuario es una variable en memoria, asi qeu lo leemos del modelo, no hace falta que hagamos nada
            return "bienvenida";    // vista con "Hola, usuario"
        }
        return "index";
    }

    @GetMapping("/alta")
    public String mostrarFormulario(Model model) {
        model.addAttribute("tecnologias", TECNOLOGIAS);
        model.addAttribute("niveles", NIVELES);
        return "formulario";
    }

    @PostMapping("/alta")
    public String procesarFormulario(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String tecnologia,
            @RequestParam(name = "nivel", required = false) List<String> niveles,
            Model model,
            HttpSession sesion) {

        // Si el nombre viene vacío: mensaje + lo ya escrito + listas → vuelta al form
        if (nombre == null || nombre.isBlank()) {
            model.addAttribute("mensaje", "El nombre es obligatorio.");
            model.addAttribute("nombre", nombre);
            model.addAttribute("email", email);
            model.addAttribute("tecnologia", tecnologia);
            model.addAttribute("nivelesSeleccionados", niveles);
            model.addAttribute("tecnologias", TECNOLOGIAS);
            model.addAttribute("niveles", NIVELES);
            return "formulario";
        }
        sesion.setAttribute("usuario", nombre.trim());
        sesion.setAttribute("altaEmail", email);
        sesion.setAttribute("altaTecnologia", tecnologia);
        sesion.setAttribute("altaNiveles", niveles == null ? List.of() : niveles);

        return "redirect:/confirmacion";
    }

    @GetMapping ("/confirmacion")
    public String confirmacion(HttpSession session, Model model){
        model.addAttribute("usuario", session.getAttribute("usuario"));
        model.addAttribute("email", session.getAttribute("altaEmail"));
        model.addAttribute("tecnologia", session.getAttribute("altaTecnologia"));
        model.addAttribute("niveles", session.getAttribute("altaNiveles"));

        return "confirmacion";
    }
    @PostMapping("logout")
    public String logout(HttpSession session) {
        session.invalidate(); // cerrar return "redirect:/";
        return "redirect:/";
    }
}
