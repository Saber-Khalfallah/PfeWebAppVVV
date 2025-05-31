import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import * as path from 'path';
import { uuid } from 'uuidv4'; // Import uuidv4

@Injectable()
export class AzureStorageService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName: string;
  private readonly logger = new Logger(AzureStorageService.name);

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString) {
      this.logger.error('Azure Storage Connection String not found in environment variables.');
      throw new Error('Azure Storage Connection String not configured.');
    }
     if (!containerName) {
      this.logger.error('Azure Storage Container Name not found in environment variables.');
      // This throw should ideally stop the app, but if it doesn't, this is why we get 'undefined'
      throw new Error('Azure Storage Container Name not configured.');
    }
    this.containerName = containerName; // Now containerName is guaranteed to be string

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, folder?: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    await containerClient.createIfNotExists(); // Ensure container exists

    const fileExtension = path.extname(originalName);
    const uniqueFileName = `${uuid()}${fileExtension}`; // Use uuidv4 for unique file name
    const blobName = folder ? `${folder}/${uniqueFileName}` : uniqueFileName; // Add folder if provided

    const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: 'application/octet-stream' },
      });
      this.logger.log(`File uploaded successfully: ${blobName}`);
      return blockBlobClient.url;
    } catch (error) {
      this.logger.error(`Error uploading file to Azure: ${error.message}`, error.stack);
      throw new Error('Failed to upload file to Azure Blob Storage.');
    }
  }

  getBlobNameFromUrl(blobUrl: string): string | null {
    if (!blobUrl) return null;
    try {
      const url = new URL(blobUrl);
      // The path will be like /container_name/folder/file.jpg or /container_name/file.jpg
      const pathSegments = url.pathname.split('/').filter(segment => segment); // Remove empty strings
      if (pathSegments.length > 1 && pathSegments[0] === this.containerName) {
        return pathSegments.slice(1).join('/'); // Returns 'folder/file.jpg' or just 'file.jpg'
      }
      return null;
    } catch (e) {
      this.logger.error(`Invalid URL for blob name extraction: ${blobUrl}`);
      return null;
    }
  }

  async deleteFile(blobName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      const response = await blockBlobClient.deleteIfExists();
      if (response.succeeded) {
        this.logger.log(`File deleted successfully: ${blobName}`);
      } else if (response.errorCode === 'BlobNotFound') {
        this.logger.warn(`Attempted to delete non-existent file: ${blobName}`);
      } else {
        this.logger.error(`Error deleting file from Azure: ${response.errorCode} - ${blobName}`);
        throw new Error(`Failed to delete file: ${blobName}`);
      }
    } catch (error) {
      this.logger.error(`Exception while deleting file from Azure: ${error.message}`, error.stack);
      throw new Error('Failed to delete file from Azure Blob Storage.');
    }
  }
}