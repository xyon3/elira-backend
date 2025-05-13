import { Test, TestingModule } from '@nestjs/testing';
import { ShelfRepository } from './shelf.repository';

describe('ShelfRepository', () => {
  let provider: ShelfRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelfRepository],
    }).compile();

    provider = module.get<ShelfRepository>(ShelfRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
