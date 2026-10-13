package es.daw.altausuariospring.services;

import es.daw.altausuariospring.exception.FicheroNoEncontradoException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.logging.Logger;

//Spring detecta en esta clase, hay un @Controlller.scan.... y aplica sus @ExceptionHandler
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger LOG = Logger.getLogger(GlobalExceptionHandler.class.getName());
    @ExceptionHandler(FicheroNoEncontradoException.class)
    public String gestionarErrorFichero(FicheroNoEncontradoException e, Model model) {
        log.error("Error al gestionar el fichero", e);
        model.addAttribute("error", e.getMessage());
        return "error";
    }
}
