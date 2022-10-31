import express from 'express';
import { assertPermission, assertPermissions } from '../management/account';
import {
    createNewApiKey,
    deleteApiKey,
    getAllApiKeys,
    getApiKeysFromAccount,
} from '../management/apiKey';
import { APIKeyWithCreatorAndPermissions } from '../models/apiKey.model';
import { AuthenticatedRequest } from '../models/auth.model';

const router = express.Router();

router.get('/', async (req: AuthenticatedRequest, res) => {
    let apiKeys: APIKeyWithCreatorAndPermissions[] = [];
    try {
        assertPermission(req, 'api_keys:show_all');
        apiKeys = await getAllApiKeys();
    } catch (_) {
        apiKeys = await getApiKeysFromAccount(req.user?.uid || '');
    }

    res.json({ apiKeys });
});

router.post('/', async (req: AuthenticatedRequest, res) => {
    const requestedPermissions: string[] =
        req.body.permissions ||
        req.permissions?.map((permission) => permission.permission.name);
    const name: string = req.body.name;

    assertPermission(req, 'api_keys:create');
    assertPermissions(req, requestedPermissions);

    const apiKey = await createNewApiKey(
        req.user?.uid || '',
        requestedPermissions,
        name
    );
    res.json({ apiKey });
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    const id: string = req.params.id;

    assertPermission(req, 'api_keys:delete');

    await deleteApiKey(id);
    res.json({ success: true });
});

module.exports = router;
