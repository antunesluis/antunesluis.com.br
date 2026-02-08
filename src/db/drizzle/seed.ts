import { JsonProjectRepository } from '@/features/projects/repositories/json-project-repository';
import { drizzleDb } from '.';
import { projectsTable } from './schemas';

// (async () => {
// 	const jsonPostRepository = new JsonPostRepository();
// 	const posts = await jsonPostRepository.findAll();
//
// 	try {
// 		await drizzleDb.delete(postsTable);
// 		await drizzleDb.insert(postsTable).values(posts);
// 		console.log("Posts inserted successfully");
// 	} catch (e) {
// 		console.error("Error inserting posts:", e);
// 	}
// })();

(async () => {
  const jsonProjectRepository = new JsonProjectRepository();
  const projects = await jsonProjectRepository.findAll();

  try {
    await drizzleDb.delete(projectsTable);

    // Transforma os projetos para o formato do banco de dados
    const projectsForDb = projects.map(project => ({
      ...project,
      techStack: JSON.stringify(project.techStack), // Converte array para JSON string
    }));

    await drizzleDb.insert(projectsTable).values(projectsForDb);
    console.log('Projects inserted successfully');
  } catch (e) {
    console.error('Error inserting projects:', e);
  }
})();
