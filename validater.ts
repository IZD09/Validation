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

        public getMessage() {
            return this.message;
        }
        public getStatus() {
            return this.status;
        }

        /**
        * @throws UndefinedError
        * @throws InvalidTypeError
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

        public setMessage(message: string) {
            this.message = message;
        }

        public setStatus(status: boolean) {
            this.status = status;
        }

        public setType(type: number) {
            this.type.push(type);
        }
    }

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

    public setCollectAllErrors(value: boolean) {
        this.collectAllErrors = value;
        return this;
    }

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

    public addNICValidator(nic: string) {
        this.addValidator(new this.ValidNIC(nic, this));
        return this;
    }

    public addBirthdayValidator(date: string) {
        this.addValidator(new this.ValidBirthday(date, this));
        return this;
    }

    public addEmailValidator(email: string, witchEmail: string) {
        this.addValidator(new this.ValidEmail(email, witchEmail, this));
        return this;
    }

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

/*************** USAGE EXAMPLE ***************/

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