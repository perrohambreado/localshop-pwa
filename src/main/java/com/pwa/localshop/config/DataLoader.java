package com.pwa.localshop.config;

import com.pwa.localshop.model.Producto;
import com.pwa.localshop.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

// mete unos productos de prueba la primera vez que se levanta la app
// (si la tabla ya tiene datos no hace nada)
@Component
public class DataLoader implements CommandLineRunner {

    private final ProductoRepository repo;

    public DataLoader(ProductoRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        repo.saveAll(List.of(
            new Producto(null, "Queso menonita", "Medio kilo, de Cuauhtémoc", 120.0, null),
            new Producto(null, "Carne seca", "Paquete de 250 g", 185.0, null),
            new Producto(null, "Tortillas de harina", "Paquete de 20, hechas a mano", 60.0, null),
            new Producto(null, "Coyotas", "Rellenas de piloncillo, 6 piezas", 75.0, null),
            new Producto(null, "Chile pasado", "Bolsa de 200 g", 90.0, null),
            new Producto(null, "Manzana golden", "Caja de 2 kg", 80.0, null)
        ));
    }
}