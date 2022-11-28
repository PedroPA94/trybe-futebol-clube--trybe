import * as express from 'express';
import { TeamController } from '../controllers';

const router = express.Router();

router.get('/', TeamController.findAll);
router.get('/:id', TeamController.findById);

export default router;
