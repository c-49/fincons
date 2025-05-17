import { Request, Response } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { CategoryService } from '../services/CategoryService';

// Mock CategoryService
jest.mock('../services/CategoryService');

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCategoryService: jest.Mocked<CategoryService>;

  beforeEach(() => {
    // Reset mocks
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockCategoryService = new CategoryService() as jest.Mocked<CategoryService>;
    (CategoryService as jest.Mock).mockImplementation(() => mockCategoryService);
    
    categoryController = new CategoryController();
  });

  describe('getCategories', () => {
    it('should return categories when successful', async () => {
      // Arrange
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

      // Act
      await categoryController.getCategories(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategories,
      });
    });

    it('should return 500 error when service throws', async () => {
      // Arrange
      mockCategoryService.getAllCategories.mockRejectedValue(new Error('Database error'));

      // Act
      await categoryController.getCategories(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to fetch categories',
      });
    });
  });
});