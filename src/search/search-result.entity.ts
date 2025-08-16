import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { type Podcast } from '../types/podcast';
import { type Episode } from '../types/episode';

@Entity()
export class SearchResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  query: string;

  @Column({ type: 'jsonb' })
  podcasts: Podcast[];

  @Column({ type: 'bigint' })
  podcastsCount: number;

  @Column({ type: 'jsonb' })
  episodes: Episode[];

  @Column({ type: 'bigint' })
  episodesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
