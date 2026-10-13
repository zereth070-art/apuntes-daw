package es.daw.altausuariospring.exception;

public class FicheroNoEncontradoException extends RuntimeException {

    public FicheroNoEncontradoException(String message) {
        super(message);
    }

    public FicheroNoEncontradoException(String message, Throwable cause) {
        super(message, cause);
    }
}
