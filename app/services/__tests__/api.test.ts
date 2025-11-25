import { getActionBlueprintGraph } from '../api';
import { ActionBlueprintGraphResponse } from '../../types/blueprint-dto';

const mockResponse: ActionBlueprintGraphResponse = {
  id: 'blueprint1',
  tenant_id: 'tenant123',
  name: 'Test Blueprint',
  description: 'Description',
  category: 'Test',
  nodes: [
    {
      id: 'node1',
      type: 'task',
      position: { x: 0, y: 0 },
      data: {
        id: 'node1',
        component_key: 'comp1',
        component_type: 'type1',
        component_id: 'c1',
        name: 'Node 1',
        prerequisites: [],
        sla_duration: { number: 1, unit: 'hours' },
        approval_required: false,
      },
    },
  ],
  edges: [{ source: 'node1', target: 'node2' }],
  forms: [
    {
      id: 'form1',
      name: 'Form 1',
      description: 'Form desc',
      is_reusable: true,
      field_schema: {},
      ui_schema: {},
      dynamic_field_config: {},
    },
  ],
};

describe('getActionBlueprintGraph', () => {
  const BASE_URL = 'https://mock-api.com';

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = BASE_URL;
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls fetch with correct URL and returns data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await getActionBlueprintGraph('tenant123', 'blueprint1');

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/tenant123/actions/blueprints/blueprint1/graph`,
    );
    expect(data).toEqual(mockResponse);
  });

  it('throws an error if response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(getActionBlueprintGraph('tenant123', 'blueprint1')).rejects.toThrow(
      'Failed to fetch action blueprint graph: Not Found',
    );
  });
});
