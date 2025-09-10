package com.pojong.code_challenge.exception;

public class MetadataNotFoundException extends NotFoundException{
    public MetadataNotFoundException(String message) {
        super(message);
    }
    public MetadataNotFoundException(Long id) {
        super(String.format("Metadata [%d] is not found", id));
    }

}
