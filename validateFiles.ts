class ValidateFilesBuilder {

    public static readonly DOCUMENT_FILE_TYPES = "Document";
    public static readonly IMAGE_FILE_TYPES = "Image";
    public static readonly VIDEO_FILE_TYPES = "Video";
    public static readonly AUDIO_FILE_TYPES = "Audio";
    public static readonly ARCHIVE_FILE_TYPES = "Archive";

    private maxSizeInBytes: number;
    private allowedTypes: string[];
    private valdateTypes: string[];

    constructor(maxSizeInBytes: number) {
        this.maxSizeInBytes = maxSizeInBytes * 1024 * 1024; // Convert MB to Bytes
        this.allowedTypes = [];
        this.valdateTypes = [];
    }

    static validateFile(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        if (file.size > maxSizeInBytes) {
            return false;
        }

        return true;
    }

    validateFiles(files: FileList): boolean {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!ValidateFilesBuilder.validateFile(file)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Add allowed file types for validation.
     * @param This method initializes the ValidateImageFileType class, which provides methods to specify allowed image file types. It returns an instance of ValidateImageFileType for chaining.
     * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
     * @param allowedTypes An array to hold the allowed file types for images.
     * @param setPNG Method to add 'image/png' to the allowed types.
     * @param setJPEG Method to add 'image/jpeg' to the allowed types.
     * @param setPDF Method to add 'application/pdf' to the allowed types.
     * @param setGIF Method to add 'image/gif' to the allowed types.
     * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
     */
    addImageFileType() {
        const imageFileType = new this.ValidateImageFileType(this);
        return imageFileType;
    }

    /**
     * Add allowed file types for validation.
     * @param This method initializes the ValidateDocumentFileType class, which provides methods to specify allowed document file types. It returns an instance of ValidateDocumentFileType for chaining.
     * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
     * @param allowedTypes An array to hold the allowed file types for documents.
     * @param setPDF Method to add 'application/pdf' to the allowed types.
     * @param setDOCX Method to add 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' to the allowed types.
     * @param setXLSX Method to add 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' to the allowed types.
     * @param setPPTX Method to add 'application/vnd.openxmlformats-officedocument.presentationml.presentation' to the allowed types.
     * @param setTXT Method to add 'text/plain' to the allowed types.
     * @param setCSV Method to add 'text/csv' to the allowed types.
     * @param setODT Method to add 'application/vnd.oasis.opendocument.text' to the allowed types.
     * @param setODS Method to add 'application/vnd.oasis.opendocument.spreadsheet' to the allowed types.
     * @param setODP Method to add 'application/vnd.oasis.opendocument.presentation' to the allowed types.
     * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
     */
    addDocumentFileType() {
        const documentFileType = new this.ValidateDocumentFileType(this);
        return documentFileType;
    }

    /**
     * Add allowed video file types for validation.
     * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
     * @param allowedTypes An array to hold the allowed file types for videos.
     * @param setMP4 Method to add 'video/mp4' to the allowed types.
     * @param setAVI Method to add 'video/avi' to the allowed types.
     * @param setMOV Method to add 'video/mov' to the allowed types.
     * @param setWMV Method to add 'video/wmv' to the allowed types.
     * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
     */
    addVideoFileType() {
        const videoFileType = new this.ValidateVideoFileType(this);
        return videoFileType;
    }

    private ValidateImageFileType = class {

        private builder: ValidateFilesBuilder;
        private allowedTypes: string[];

        /**
         * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
         * @param allowedTypes An array to hold the allowed file types for images.
         * @param setPNG Method to add 'image/png' to the allowed types.
         * @param setJPEG Method to add 'image/jpeg' to the allowed types.
         * @param setPDF Method to add 'application/pdf' to the allowed types.
         * @param setGIF Method to add 'image/gif' to the allowed types.
         * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
         */
        constructor(builder: ValidateFilesBuilder) {
            this.builder = builder;
            this.allowedTypes = [];
        }

        public setPNG() {
            this.allowedTypes.push('image/png');
            return this;
        }
        public setJPEG() {
            this.allowedTypes.push('image/jpeg');
            return this;
        }
        public setPDF() {
            this.allowedTypes.push('application/pdf');
            return this;
        }
        public setGIF() {
            this.allowedTypes.push('image/gif');
            return this;
        }

        public apply() {
            this.builder.allowedTypes.push(...this.allowedTypes);
            return this.builder;
        }
    }

    private ValidateDocumentFileType = class {

        private builder: ValidateFilesBuilder;
        private allowedTypes: string[];

        /**
         * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
         * @param allowedTypes An array to hold the allowed file types for documents.
         * @param setPDF Method to add 'application/pdf' to the allowed types.
         * @param setDOCX Method to add 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' to the allowed types.
         * @param setXLSX Method to add 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' to the allowed types.
         * @param setPPTX Method to add 'application/vnd.openxmlformats-officedocument.presentationml.presentation' to the allowed types.
         * @param setTXT Method to add 'text/plain' to the allowed types.
         * @param setCSV Method to add 'text/csv' to the allowed types.
         * @param setODT Method to add 'application/vnd.oasis.opendocument.text' to the allowed types.
         * @param setODS Method to add 'application/vnd.oasis.opendocument.spreadsheet' to the allowed types.
         * @param setODP Method to add 'application/vnd.oasis.opendocument.presentation' to the allowed types.
         * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
         */
        constructor(builder: ValidateFilesBuilder) {
            this.builder = builder;
            this.allowedTypes = [];
        }

        public setPDF() {
            this.allowedTypes.push('application/pdf');
            return this;
        }

        public setDOCX() {
            this.allowedTypes.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            return this;
        }
        public setXLSX() {
            this.allowedTypes.push('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return this;
        }
        public setPPTX() {
            this.allowedTypes.push('application/vnd.openxmlformats-officedocument.presentationml.presentation');
            return this;
        }
        public setTXT() {
            this.allowedTypes.push('text/plain');
            return this;
        }
        public setCSV() {
            this.allowedTypes.push('text/csv');
            return this;
        }
        public setODT() {
            this.allowedTypes.push('application/vnd.oasis.opendocument.text');
            return this;
        }
        public setODS() {
            this.allowedTypes.push('application/vnd.oasis.opendocument.spreadsheet');
            return this;
        }
        public setODP() {
            this.allowedTypes.push('application/vnd.oasis.opendocument.presentation');
            return this;
        }

        public apply() {
            this.builder.allowedTypes.push(...this.allowedTypes);
            return this.builder;
        }
    }

    private ValidateVideoFileType = class {

        private builder: ValidateFilesBuilder;
        private allowedTypes: string[];

        /**
         * @param builder The instance of ValidateFilesBuilder to which the allowed types will be added.
         * @param allowedTypes An array to hold the allowed file types for videos.
         * @param setMP4 Method to add 'video/mp4' to the allowed types.
         * @param setAVI Method to add 'video/avi' to the allowed types.
         * @param setMOV Method to add 'video/quicktime' to the allowed types.
         * @param setWMV Method to add 'video/x-ms-wmv' to the allowed types.
         * @param setMKV Method to add 'video/x-matroska' to the allowed types.
         * @param apply Method to apply the allowed types to the builder and return the builder instance for chaining.
         */
        constructor(builder: ValidateFilesBuilder) {
            this.builder = builder;
            this.allowedTypes = [];
        }

        public setMP4() {
            this.allowedTypes.push('video/mp4');
            return this;
        }

        public setAVI() {
            this.allowedTypes.push('video/avi');
            return this;
        }
        public setMOV() {
            this.allowedTypes.push('video/quicktime');
            return this;
        }
        public setWMV() {
            this.allowedTypes.push('video/x-ms-wmv');
            return this;
        }
        public setMKV() {
            this.allowedTypes.push('video/x-matroska');
            return this;
        }

        public apply() {
            this.builder.allowedTypes.push(...this.allowedTypes);
            return this.builder;
        }
    }
}

function validateFiles(files: FileList): boolean {
    const builder = new ValidateFilesBuilder(5);

    builder.
        addImageFileType().setPNG().setJPEG().setPDF().setGIF().apply().
        addDocumentFileType().setPDF().setDOCX().setXLSX().setPPTX().setTXT().setCSV().setODT().setODS().setODP().apply().
        addVideoFileType().setMP4().apply();

    return builder.validateFiles(files);
}