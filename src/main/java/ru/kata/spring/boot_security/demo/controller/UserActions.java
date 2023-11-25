package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserActions {

    private final UserService userService;

    @Autowired
    public UserActions(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String userPage(Model model, Principal principal) {
        model.addAttribute("user_current", userService.getUserByName(principal.getName()));
        return "user";
    }
}
