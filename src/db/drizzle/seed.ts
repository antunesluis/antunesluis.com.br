import projectsSeed from '../seed/projects.json';
import { drizzleDb } from '.';
import {
  ProjectsTableInsertMode,
  projectsTable,
} from './schemas';

const projects = projectsSeed.projects satisfies ProjectsTableInsertMode[];

try {
  drizzleDb.transaction(transaction => {
    transaction.delete(projectsTable).run();
    transaction.insert(projectsTable).values(projects).run();
  });
  console.log('Projects inserted successfully');
} catch (error) {
  console.error('Error inserting projects:', error);
  process.exitCode = 1;
}
