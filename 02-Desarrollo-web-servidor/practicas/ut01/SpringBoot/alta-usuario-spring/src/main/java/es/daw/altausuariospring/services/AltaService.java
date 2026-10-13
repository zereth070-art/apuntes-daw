package es.daw.altausuariospring.services;

import es.daw.altausuariospring.exception.FicheroNoEncontradoException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class AltaService {
    public List<String> getTecnologias() { return leerFichero("datos/tecnologias.txt"); }
    public List<String> getNiveles()     { return leerFichero("datos/niveles.txt"); }

    private List<String> leerFichero(String ruta) {
        ClassPathResource recurso = new ClassPathResource(ruta);   // antes: sc.getResourceAsStream(...)
        if (!recurso.exists()) {
            throw new FicheroNoEncontradoException("No se encuentra el fichero " + ruta);
        }
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(recurso.getInputStream(), StandardCharsets.UTF_8))) {
            return br.lines().filter(l -> !l.isBlank()).map(String::trim).toList();
        } catch (IOException e) {
            throw new FicheroNoEncontradoException("Error leyendo " + ruta, e);
        }
    }
}
