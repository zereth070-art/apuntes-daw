package es.avellaneda.Controller;

import es.avellaneda.dto.UsuarioDTO;
import es.avellaneda.service.AltaService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Slf4j
@Controller
public class AltaValidacionController {

    private final AltaService service;

    public AltaValidacionController(AltaService service) {
        this.service = service;
    }

    @ModelAttribute("tecnologias")
    public List<String> tecnologias() {
        return service.getTecnologias();
    }

    @ModelAttribute("niveles")
    public List<String> niveles() {
        return service.getNiveles();
    }

    @GetMapping("/alta-validacion")
    public String mostrarFormulario(Model model) {
        model.addAttribute("usuario", new UsuarioDTO());
        return "formulario-validacion";
    }

    @PostMapping("/alta-validacion")
    public String procesarFormulario(
            @Valid @ModelAttribute("usuario") UsuarioDTO usuario,
            // BindingResult guarda los errores de ese objeto
            // Tiene que ir justo despues del @ModelAttribute
            // Si usamos @Valid y hay errores y no ponemos BindingResult,
            // Spring lanza error 400 (MethodArgumentNotValidException)
            BindingResult bindingResult,
            Model model) {

        log.info("Alta recibida (Bean validation): {}", usuario);

        if (bindingResult.hasErrors()) {
            log.warn("Errores de validacion: {}", bindingResult.getAllErrors());
            return "formulario-validacion";
        }

        service.registrar(usuario);
        model.addAttribute("usuario", usuario);
        return "confirmacion-validacion";
    }
}
