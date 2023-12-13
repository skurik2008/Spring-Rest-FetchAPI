package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.MyUser;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping
public class AdminRestController {
    private final UserService userService;

    @Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/api/admins")
    public ResponseEntity<List<MyUser>> getUsers() {

        final List<MyUser> users = userService.getUsers();

        return users != null && !users.isEmpty()
                ? new ResponseEntity<>(users, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/api/admins/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        final MyUser user = userService.getUser(id);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/admins")
    public ResponseEntity<?> add(@RequestBody MyUser user) {
        userService.addUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PatchMapping("/api/admins/{id}")
    public ResponseEntity<?> update(@RequestBody MyUser user, @PathVariable("id") Long id, Principal principal) {
        userService.updateUser(user, userService.getUserByName(principal.getName()).getId());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/api/admins/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
