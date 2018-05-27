package com.github.freongrr.run.controllers;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.services.AttributeService;

@RestController
public final class AttributeController {

    private final AttributeService service;

    @Autowired
    public AttributeController(AttributeService service) {
        this.service = service;
    }

    @RequestMapping(path = "/api/attributes", method = RequestMethod.GET)
    public Collection<Attribute> getActivities() {
        return service.getAttributes();
    }
}
