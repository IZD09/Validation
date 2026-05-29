interface Valideter {
    validate(): void;
}

/*************** ERROR CLASSES ***************/

class UndefinedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UndefinedError";
    }
}

class InvalideTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalideTypeError";
    }
}

/*************** VALIDATION BUILDER ***************/
/** * A builder class for validating various types of input data, such as text, passwords, NIC numbers, birthdays, emails, and mobile numbers. It collects validation errors and provides a structured validation message.
 */
class ValidatBuilder {

    private VALIDATION_MESSAGE;

    private VALIDATE_LIST: Valideter[];

    private errors: string[];
    private collectAllErrors: boolean;

    /*************** VALIDATION MESSAGE ***************/

    private ValidationMessage = class {
        private message: string;
        private status: boolean;
        private type: number[];

        constructor() {
            this.message = "";
            this.status = false;
            this.type = [];
        }

        /** Getters and setters for the validation message, status, and type. The getType method throws errors if the requested type index is undefined or invalid.
         * @throws UndefinedError if the type index is not provided
         * @throws InvalidTypeError if the type index is out of range
         */
        public getMessage() {
            return this.message;
        }

        /**
         *  @return The validation status (true if there are validation errors, false otherwise)
         */
        public getStatus() {
            return this.status;
        }

        /** 
         * @param whichOne - The index of the type to retrieve (1-based index)
         * @return The type at the specified index
         * @throws UndefinedError if the type index is not provided
         * @throws InvalidTypeError if the type index is out of range
         */
        public getType(whichOne?: number) {

            if (whichOne === undefined) {
                throw new UndefinedError("Type index is required");
            } else if (whichOne < 1 || whichOne > this.type.length) {
                throw new InvalideTypeError("Invalid type index");
            } else {
                return this.type[whichOne - 1];
            }
        }

        /**
         * @return An array of all types
         */
        public getAllTypes() {
            return this.type;
        }

        /** Setters for the validation message, status, and type. The setType method allows adding a new type to the list of types.
         * @param message - The validation message to set
         */
        public setMessage(message: string) {
            this.message = message;
        }

        /**
         * @param status - The validation status to set (true if there are validation errors, false otherwise)
         */
        public setStatus(status: boolean) {
            this.status = status;
        }

        /**
         * @param type - The type to add to the list of types
         */
        public setType(type: number) {
            this.type.push(type);
        }
    }

    /*************** CONSTRUCTOR ***************/
    /** * Initializes the ValidatBuilder with a new ValidationMessage instance, an empty list of validators, and an empty list of errors. The collectAllErrors flag is set to false by default, meaning that only the first validation error will be collected unless this flag is set to true.
     */
    public constructor() {
        this.VALIDATION_MESSAGE = new this.ValidationMessage();
        this.VALIDATE_LIST = [];
        this.errors = [];
        this.collectAllErrors = false;
    }

    private addValidator(validator: Valideter) {
        this.VALIDATE_LIST.push(validator);
    }

    /*************** COLLECT ALL ERRORS ***************/

    private addError(message: string) {
        if (this.collectAllErrors) {
            this.errors.push(message);
        } else if (!this.VALIDATION_MESSAGE.getStatus()) {
            this.errors = [message];
            this.VALIDATION_MESSAGE.setStatus(true);
        }
    }

    /** * Set whether to collect all validation errors or just the first one.
     * If set to true, all validation errors will be collected and included in the validation message. If set to false, only the first validation error will be collected.
     * @param value - A boolean value indicating whether to collect all validation errors (true) or just the first one (false)
     * @return The ValidatBuilder instance for method chaining
     */
    public setCollectAllErrors(value: boolean) {
        this.collectAllErrors = value;
        return this;
    }

    /*************** VALIDATION ***************/
    /** * Validates the input data using the added validators.
     * It iterates through the list of validators and calls their validate method.
     * If there are validation errors, it constructs a validation message based on the collected errors and sets the validation status accordingly.
     * The validation message is constructed by joining all collected error messages with a comma and adding a period at the end. The method returns the ValidationMessage instance containing the validation results.
     * @return The ValidationMessage instance containing the validation results, including the validation message, status, and types of errors
     */
    public validate() {
        for (const validator of this.VALIDATE_LIST) {
            validator.validate();
        }

        if (this.errors.length > 1) {
            this.VALIDATION_MESSAGE.setMessage(this.errors.join(", "));
        } else {
            this.VALIDATION_MESSAGE.setMessage(this.errors[0]);
        }

        this.VALIDATION_MESSAGE.setMessage(this.VALIDATION_MESSAGE.getMessage() + ".");

        return this.VALIDATION_MESSAGE;
    }

    /*************** VALIDATER ***************/

    /** * Add a text validator to the ValidatBuilder.
     * This validator checks if the provided text is not empty, and if its length is within the specified maximum and minimum size limits.
     * The type parameter is used to specify the type of text being validated (e.g., "username", "email", etc.) for error message purposes.
     * @param text - The text to validate
     * @param type - A string representing the type of text being validated (e.g., "username", "email", etc.) for error message purposes
     * @param maxSize - The maximum allowed length of the text
     * @param minSize - The minimum allowed length of the text
     * @return The ValidatBuilder instance for method chaining
     */
    public addTextValidator(
        text: string,
        type: string,
        maxSize: number,
        minSize: number
    ) {
        this.addValidator(new this.ValidText(
            text,
            type,
            maxSize,
            minSize,
            this
        ));

        return this;
    }

    /** * Add a password validator to the ValidatBuilder.
     * This validator checks if the provided passwords meet the specified maximum and minimum size limits, and if they match each other.
     * The password1 parameter is the primary password to validate, while password2 is the confirmation password that must match password1.
     * The type parameter is used to specify the type of password being validated (e.g., "password") for error message purposes.
     * @param password1 - The primary password to validate
     * @param password2 - The confirmation password that must match password1
     * @param maxSize - The maximum allowed length of the passwords
     * @param minSize - The minimum allowed length of the passwords
     * @return The ValidatBuilder instance for method chaining
     */
    public addPasswordValidator(
        password1: string,
        password2: string,
        maxSize: number,
        minSize: number
    ) {
        this.addValidator(new this.ValidPassword(
            password1,
            password2,
            maxSize,
            minSize,
            this
        ));

        return this;
    }

    /** * Add a NIC validator to the ValidatBuilder.
     * This validator checks if the provided NIC number is not empty and if its length is either 10 or 12 characters, which are common formats for NIC numbers.
     * The error messages will indicate whether the NIC number is missing or invalid based on these criteria.
     * @param nic - The NIC number to validate
     * @return The ValidatBuilder instance for method chaining
     */
    public addNICValidator(nic: string) {
        this.addValidator(new this.ValidNIC(nic, this));
        return this;
    }

    /** * Add a birthday validator to the ValidatBuilder.
     * This validator checks if the provided date is a valid birthday date.
     * @param date - The date to validate
     * @return The ValidatBuilder instance for method chaining
     */
    public addBirthdayValidator(date: string) {
        this.addValidator(new this.ValidBirthday(date, this));
        return this;
    }

    /** * Add an email validator to the ValidatBuilder.
     * This validator checks if the provided email is valid and if it matches the confirmation email.
     * @param email - The email to validate
     * @param witchEmail - The confirmation email that must match the primary email
     * @return The ValidatBuilder instance for method chaining
     */
    public addEmailValidator(email: string, witchEmail: string) {
        this.addValidator(new this.ValidEmail(email, witchEmail, this));
        return this;
    }

    /** * Add a mobile number validator to the ValidatBuilder.
     * This validator checks if the provided mobile number is valid based on a specific regex pattern.
     * The name parameter is used to specify the type of mobile number being validated (e.g., "mobile number") for error message purposes.
     * @param mobile - The mobile number to validate
     * @param name - A string representing the type of mobile number being validated (e.g., "mobile number") for error message purposes
     * @return The ValidatBuilder instance for method chaining
     */
    public addMobileValidator(mobile: string, name: string) {
        this.addValidator(new this.ValidMobile(mobile, name, this));
        return this;
    }


    /*************** TEXT ***************/

    private ValidText = class implements Valideter {

        private text: string;
        private type: string;
        private maxSize: number;
        private minSize: number;
        private builder: ValidatBuilder;

        constructor(
            text: string,
            type: string,
            maxSize: number,
            minSize: number,
            builder: ValidatBuilder
        ) {
            this.text = text;
            this.type = type;
            this.maxSize = maxSize;
            this.minSize = minSize;
            this.builder = builder;
        }

        validate() {

            let type = 0;

            if (this.text === "" || this.text === null) {

                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}enter the ${this.type}`);
                type = 1;

                this.builder.VALIDATION_MESSAGE.setStatus(true);
            } else if (this.text.length >= this.maxSize) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "The "}${this.type} is too long`);
                type = 2;

                this.builder.VALIDATION_MESSAGE.setStatus(true);
            } else if (this.text.length <= this.minSize) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "The "}${this.type} is too short`);
                type = 3;

                this.builder.VALIDATION_MESSAGE.setStatus(true);
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }

    /*************** PASSWORD ***************/

    private ValidPassword = class implements Valideter {

        private password1: string;
        private password2: string;
        private maxSize: number;
        private minSize: number;
        private builder: ValidatBuilder;

        constructor(
            password1: string,
            password2: string,
            maxSize: number,
            minSize: number,
            builder: ValidatBuilder
        ) {
            this.password1 = password1;
            this.password2 = password2;
            this.maxSize = maxSize;
            this.minSize = minSize;
            this.builder = builder;
        }

        validate() {

            let type: number = 0;

            const checkPassword = new ValidatBuilder().setCollectAllErrors(false).addTextValidator(this.password1, "password", this.maxSize, this.minSize).validate();

            if (checkPassword.getStatus()) {
                this.builder.addError(checkPassword.getMessage());
                type = checkPassword.getType(1);

                this.builder.VALIDATION_MESSAGE.setStatus(checkPassword.getStatus());

            } else if (this.password2 === "" || this.password2 === null) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}confirm password`);
                type = 4;
                this.builder.VALIDATION_MESSAGE.setStatus(true);

            } else if (this.password1 !== this.password2) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "passwords" : "Passwords"} do not match`);
                type = 5;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }

    /*************** NIC ***************/

    private ValidNIC = class implements Valideter {

        private nic: string;
        private builder: ValidatBuilder;

        constructor(
            nic: string,
            builder: ValidatBuilder
        ) {
            this.nic = nic;
            this.builder = builder;
        }

        validate() {

            let type = 0;

            if (this.nic === "" || this.nic === null) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}enter NIC number`);
                type = 6;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            } else if (this.nic.length !== 10 && this.nic.length !== 12) {
                this.builder.addError("Invalid NIC number");
                type = 7;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }

    /*************** BIRTHDAY ***************/

    private ValidBirthday = class implements Valideter {

        private date: string;
        private builder: ValidatBuilder;

        constructor(
            date: string,
            builder: ValidatBuilder
        ) {
            this.date = date;
            this.builder = builder;
        }

        validate() {

            const regex = /^\d{4}-\d{2}-\d{2}$/;

            let type = 0;

            if (this.date === "" || this.date === null) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}enter the date of birth`);
                type = 8;
                this.builder.VALIDATION_MESSAGE.setStatus(true);

            } else if (!regex.test(this.date)) {
                this.builder.addError("Invalid date format");
                type = 9;
                this.builder.VALIDATION_MESSAGE.setStatus(true);

            } else if (new Date(this.date) > new Date()) {
                this.builder.addError("Invalid birthday");
                type = 10;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }

    /*************** EMAIL ***************/

    private ValidEmail = class implements Valideter {

        private email: string;
        private witchEmail: string;
        private builder: ValidatBuilder;

        constructor(
            email: string,
            witchEmail: string,
            builder: ValidatBuilder
        ) {
            this.email = email;
            this.witchEmail = witchEmail;
            this.builder = builder;
        }

        validate() {

            const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            let type = 0;

            if (this.email === "" || this.email === null) {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}enter the ${this.witchEmail} address`);
                type = 11;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            } else if (!regex.test(this.email)) {
                this.builder.addError(`Invalid ${this.witchEmail} address`);
                type = 12;
                this.builder.VALIDATION_MESSAGE.setStatus(true);
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }

    /*************** MOBILE ***************/

    private ValidMobile = class implements Valideter {

        private mobile: string;
        private name: string;
        private builder: ValidatBuilder;

        constructor(
            mobile: string,
            name: string,
            builder: ValidatBuilder
        ) {
            this.mobile = mobile;
            this.name = name;
            this.builder = builder;
        }

        validate() {

            const regex = /^[0][7][01245678][0-9]{7}$/;
            let type = 0;

            if (this.name === "" || this.name === null) {
                this.name = "mobile number";
            }

            if (this.mobile === "") {
                this.builder.addError(`${this.builder.VALIDATION_MESSAGE.getStatus() ? "" : "Please "}enter the ${this.name}`);
                this.builder.VALIDATION_MESSAGE.setStatus(true);
                type = 13;
            } else if (!regex.test(this.mobile)) {
                this.builder.addError(`Invalid ${this.name}`);
                this.builder.VALIDATION_MESSAGE.setStatus(true);
                type = 14;
            }

            this.builder.VALIDATION_MESSAGE.setType(type);
        }
    }
}
