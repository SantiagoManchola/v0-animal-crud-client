# API Documentation - Animal CRUD System

## Descripción General
Esta documentación describe los endpoints necesarios para el backend SpringBoot que soportará el cliente CRUD de animales.

## Modelo de Datos

### Animal Entity
\`\`\`java
@Entity
@Table(name = "animals")
public class Animal {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String species;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(nullable = false)
    private Boolean isWild;
    
    // Constructors, getters, setters
}
\`\`\`

## Endpoints Requeridos

### 1. Crear Animal (PUT)
**Endpoint:** `PUT /api/animals`
**Descripción:** Crea un nuevo animal en el sistema

**Request Body:**
\`\`\`json
{
    "name": "León",
    "species": "Panthera leo",
    "age": 5,
    "isWild": true
}
\`\`\`

**Response:** `ResponseEntity<Animal>`
\`\`\`java
@PutMapping("/animals")
public ResponseEntity<Animal> createAnimal(@RequestBody AnimalRequest request) {
    // Generar ID único
    String id = "animal_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    
    Animal animal = new Animal();
    animal.setId(id);
    animal.setName(request.getName());
    animal.setSpecies(request.getSpecies());
    animal.setAge(request.getAge());
    animal.setIsWild(request.getIsWild());
    
    Animal savedAnimal = animalRepository.save(animal);
    return ResponseEntity.ok(savedAnimal);
}
\`\`\`

### 2. Listar Todos los Animales (GET)
**Endpoint:** `GET /api/animals?filter={filter}`
**Descripción:** Obtiene todos los animales con filtro opcional

**Query Parameters:**
- `filter` (opcional): "all", "wild", "domestic"

**Response:** `ResponseEntity<List<Animal>>`
\`\`\`java
@GetMapping("/animals")
public ResponseEntity<List<Animal>> getAllAnimals(@RequestParam(defaultValue = "all") String filter) {
    List<Animal> animals;
    
    switch (filter) {
        case "wild":
            animals = animalRepository.findByIsWild(true);
            break;
        case "domestic":
            animals = animalRepository.findByIsWild(false);
            break;
        default:
            animals = animalRepository.findAll();
    }
    
    return ResponseEntity.ok(animals);
}
\`\`\`

### 3. Buscar Animal por ID (POST)
**Endpoint:** `POST /api/animals/search`
**Descripción:** Busca un animal específico por ID

**Request Body:**
\`\`\`json
{
    "id": "animal_1234567890_abcd1234"
}
\`\`\`

**Response:** `ResponseEntity<Animal>`
\`\`\`java
@PostMapping("/animals/search")
public ResponseEntity<Animal> searchAnimal(@RequestBody SearchRequest request) {
    Optional<Animal> animal = animalRepository.findById(request.getId());
    
    if (animal.isPresent()) {
        return ResponseEntity.ok(animal.get());
    } else {
        return ResponseEntity.notFound().build();
    }
}
\`\`\`

### 4. Actualizar Animal (PUT)
**Endpoint:** `PUT /api/animals/{id}`
**Descripción:** Actualiza un animal existente

**Path Variable:** `id` - ID del animal a actualizar

**Request Body:**
\`\`\`json
{
    "name": "León Actualizado",
    "species": "Panthera leo",
    "age": 6,
    "isWild": true
}
\`\`\`

**Response:** `ResponseEntity<Animal>`
\`\`\`java
@PutMapping("/animals/{id}")
public ResponseEntity<Animal> updateAnimal(@PathVariable String id, @RequestBody AnimalRequest request) {
    Optional<Animal> existingAnimal = animalRepository.findById(id);
    
    if (existingAnimal.isPresent()) {
        Animal animal = existingAnimal.get();
        animal.setName(request.getName());
        animal.setSpecies(request.getSpecies());
        animal.setAge(request.getAge());
        animal.setIsWild(request.getIsWild());
        
        Animal updatedAnimal = animalRepository.save(animal);
        return ResponseEntity.ok(updatedAnimal);
    } else {
        return ResponseEntity.notFound().build();
    }
}
\`\`\`

### 5. Eliminar Animal (DELETE)
**Endpoint:** `DELETE /api/animals/{id}`
**Descripción:** Elimina un animal del sistema

**Path Variable:** `id` - ID del animal a eliminar

**Response:** `ResponseEntity<Void>`
\`\`\`java
@DeleteMapping("/animals/{id}")
public ResponseEntity<Void> deleteAnimal(@PathVariable String id) {
    if (animalRepository.existsById(id)) {
        animalRepository.deleteById(id);
        return ResponseEntity.ok().build();
    } else {
        return ResponseEntity.notFound().build();
    }
}
\`\`\`

## Clases de Soporte

### AnimalRequest DTO
\`\`\`java
public class AnimalRequest {
    private String name;
    private String species;
    private Integer age;
    private Boolean isWild;
    
    // Constructors, getters, setters, validation annotations
}
\`\`\`

### SearchRequest DTO
\`\`\`java
public class SearchRequest {
    private String id;
    
    // Constructor, getter, setter
}
\`\`\`

### Repository Interface
\`\`\`java
@Repository
public interface AnimalRepository extends JpaRepository<Animal, String> {
    List<Animal> findByIsWild(Boolean isWild);
}
\`\`\`

## Configuración Requerida

### 1. CORS Configuration
\`\`\`java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
\`\`\`

### 2. Database Configuration (application.yml)
\`\`\`yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
\`\`\`

### 3. Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
\`\`\`

## Manejo de Errores

### Global Exception Handler
\`\`\`java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("ANIMAL_NOT_FOUND", ex.getMessage());
        return ResponseEntity.notFound().build();
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse("VALIDATION_ERROR", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
\`\`\`

## Tests Unitarios Sugeridos

### Controller Tests
\`\`\`java
@WebMvcTest(AnimalController.class)
class AnimalControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AnimalService animalService;
    
    @Test
    void createAnimal_ShouldReturnCreatedAnimal() throws Exception {
        // Test implementation
    }
    
    @Test
    void getAllAnimals_ShouldReturnFilteredList() throws Exception {
        // Test implementation
    }
    
    // Más tests...
}
\`\`\`

## Notas de Implementación

1. **Validaciones:** Implementar validaciones usando Bean Validation (@NotNull, @NotBlank, @Min, etc.)
2. **Logging:** Agregar logging apropiado para debugging y monitoreo
3. **Transacciones:** Usar @Transactional donde sea necesario
4. **Paginación:** Considerar implementar paginación para el endpoint GET si se esperan muchos registros
5. **Seguridad:** Implementar autenticación/autorización según los requerimientos del proyecto

## URL Base Sugerida
\`\`\`
http://localhost:8080/api
\`\`\`

Esta documentación proporciona todo lo necesario para implementar el backend SpringBoot que soportará completamente el cliente CRUD de animales desarrollado en Next.js.
