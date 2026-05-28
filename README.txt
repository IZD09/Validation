/*************** USAGE EXAMPLE ***************/

Code Example

function myValidate() {
    const validator = new ValidatBuilder()
        .setCollectAllErrors(true)
        .addTextValidator("John", "first name", 50, 2)
        .addTextValidator("Done", "larst name", 50, 2)
        .addPasswordValidator("password123", "password123", 20, 6)
        .addNICValidator("123456789V")
        .addBirthdayValidator("1990-01-01")
        .addEmailValidator("john.doe@example.com", "email")
        .addMobileValidator("0712345678", "mobile number")
        .validate();

    const validationMessage = validator.getMessage();
    const validationStatus = validator.getStatus();
    let validationType = null;

    try {
        validationType = validator.getType(1);
    } catch (error) {
        if (error instanceof UndefinedError) {
            console.error("UndefinedError:", error.message);
        } else if (error instanceof InvalideTypeError) {
            console.error("InvalidTypeError:", error.message);
        }
    }
    // Example: Get the first error type
    console.log(validationMessage);
    console.log(validationStatus);
    console.log(validationType);
}
