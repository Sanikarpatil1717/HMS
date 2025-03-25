package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}
	@Bean
	public RouteLocator myCustomeRouteLocator(RouteLocatorBuilder builder) {
		String[] method = {"GET","POST","PATCH","DELETE","PUT"};
		return builder.routes()
				.route(r->r.path("/api/users/**").and().method(method).uri("http://localhost:8080"))
				.route(r->r.path("/api/doctors/**").and().method(method).uri("http://localhost:8080"))
				.route(r->r.path("/admin/**").and().method(method).uri("http://localhost:8082"))
				.route(r->r.path("/appointments/**").and().method(method).uri("http://localhost:8081"))
				.build();
	}	
}
