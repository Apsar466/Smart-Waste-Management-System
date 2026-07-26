package com.smartwaste.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Uploads the file and returns the accessible URL path.
     */
    String storeFile(MultipartFile file);
}
