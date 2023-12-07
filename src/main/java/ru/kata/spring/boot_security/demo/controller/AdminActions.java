package ru.kata.spring.boot_security.demo.controller;

import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;


@Controller
@RequestMapping("/admin")
public class AdminActions {
    private final UserService userService;

    @Autowired
    public AdminActions(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String adminPage(Model model, Principal principal) {
        model.addAttribute("user_current", userService.getUserByName(principal.getName()));
        return "admin";
    }
}
