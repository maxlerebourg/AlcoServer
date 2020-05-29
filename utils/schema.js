import { Category, sequelize } from '../models.js';

async function validateCategory(req) {
	const { category: slug } = req.query;
	if (slug) {
		const category = await Category.findOne({
			attributes: ['id'],
			where: { slug }
		});
		if (!category) {
			return false;
		}
		req.query.categoryId = category.id;
	}
}

export { validateCategory };