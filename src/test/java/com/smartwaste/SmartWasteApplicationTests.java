package com.smartwaste;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class SmartWasteApplicationTests {

    @Test
    void contextLoads() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("adminpassword");
        System.out.println("==================================================");
        System.out.println("VERIFIED BCRYPT HASH OF adminpassword:");
        System.out.println(hash);
        System.out.println("==================================================");
    }
}
