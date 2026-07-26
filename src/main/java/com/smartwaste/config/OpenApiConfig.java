package com.smartwaste.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartWasteOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("AI-Powered Smart Waste Management System API")
                        .description("""
                                Production-ready REST API for the Smart Waste Management System.
                                
                                **Features:**
                                - JWT-based authentication (USER & ADMIN roles)
                                - AI waste image analysis via Google Gemini API
                                - Multilingual responses (English, Hindi, Tamil, Malayalam)
                                - Illegal dumping complaint submission with AI evaluation
                                - Smart chatbot for waste management queries
                                - Pickup scheduling and tracking
                                - Gamified rewards and badges
                                - Real-time notifications
                                
                                **Default Admin Credentials:**
                                - Email: admin@smartwaste.com
                                - Password: adminpassword
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Smart Waste Management Team")
                                .email("support@smartwaste.com"))
                        .license(new License()
                                .name("Academic Use Only")
                                .url("https://smartwaste.com/license")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your JWT access token obtained from POST /auth/login")));
    }
}
