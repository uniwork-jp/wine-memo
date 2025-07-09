'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WineChart } from '../components';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Button, 
  Grid, 
  Group, 
  Stack, 
  Badge, 
  Loader, 
  Alert,
  Box,
  Flex,
  Paper,
  Modal,
  ActionIcon,
  Tooltip,
  TextInput,
  NumberInput,
  Textarea,
  Select
} from '@mantine/core';
import { IconGlass, IconPlus, IconStar, IconMapPin, IconCalendar, IconTrash, IconEdit } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import RadarChart from '../components/RaderChart';

interface Wine {
  id: string;
  name: string;
  characteristics: {
    sweetness: number;
    body: number;
    acidity: number;
    tannin: number;
    bitterness: number;
  };
  notes?: string;
  rating?: number;
  vintage?: string;
  region?: string;
  grapeVariety?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [wineToDelete, setWineToDelete] = useState<Wine | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [wineToUpdate, setWineToUpdate] = useState<Wine | null>(null);
  const [updating, setUpdating] = useState(false);
  const [wineCharacteristics, setWineCharacteristics] = useState({
    甘口: 50,
    軽い: 50,
    酸味が弱い: 50,
    渋みが弱い: 50,
    苦味が少ない: 50,
  });

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await fetch('/api/wine/list');
        const data = await response.json();
        
        if (data.success) {
          setWines(data.wines);
        } else {
          setError(data.error || 'ワイン記録の取得に失敗しました');
        }
      } catch (err) {
        setError('ワイン記録の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (wine: Wine) => {
    setWineToDelete(wine);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!wineToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/wine/delete/${wineToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the wine from the local state
        setWines(wines.filter(wine => wine.id !== wineToDelete.id));
        setDeleteModalOpen(false);
        setWineToDelete(null);
      } else {
        setError(data.error || '削除に失敗しました');
      }
    } catch (err) {
      setError('削除中にエラーが発生しました');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setWineToDelete(null);
  };

  // Form for updating wine
  const updateForm = useForm({
    initialValues: {
      wineName: '',
      notes: '',
      rating: 0,
      region: '',
      vintage: '',
      grapeVariety: '',
    },
    validate: {
      wineName: (value) => (value.length < 2 ? 'ワイン名は2文字以上で入力してください' : null),
      rating: (value) => (value < 0 || value > 5 ? '評価は0-5の間で入力してください' : null),
    },
  });

  const handleUpdateClick = (wine: Wine) => {
    setWineToUpdate(wine);
    
    // Convert English characteristics to Japanese format for the form
    setWineCharacteristics({
      甘口: wine.characteristics.sweetness,
      軽い: wine.characteristics.body,
      酸味が弱い: wine.characteristics.acidity,
      渋みが弱い: wine.characteristics.tannin,
      苦味が少ない: wine.characteristics.bitterness,
    });

    // Set form values
    updateForm.setValues({
      wineName: wine.name,
      notes: wine.notes || '',
      rating: wine.rating || 0,
      region: wine.region || '',
      vintage: wine.vintage || '',
      grapeVariety: wine.grapeVariety || '',
    });

    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (values: typeof updateForm.values) => {
    if (!wineToUpdate) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/wine/update/${wineToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wineName: values.wineName,
          wineCharacteristics,
          notes: values.notes || null,
          rating: values.rating || null,
          region: values.region || null,
          vintage: values.vintage || null,
          grapeVariety: values.grapeVariety || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the wine in the local state
        const updatedWine = {
          ...wineToUpdate,
          name: values.wineName,
          characteristics: {
            sweetness: wineCharacteristics.甘口,
            body: wineCharacteristics.軽い,
            acidity: wineCharacteristics.酸味が弱い,
            tannin: wineCharacteristics.渋みが弱い,
            bitterness: wineCharacteristics.苦味が少ない,
          },
          notes: values.notes || undefined,
          rating: values.rating || undefined,
          region: values.region || undefined,
          vintage: values.vintage || undefined,
          grapeVariety: values.grapeVariety || undefined,
          updatedAt: new Date().toISOString(),
        };

        setWines(wines.map(wine => 
          wine.id === wineToUpdate.id ? updatedWine : wine
        ));

        setUpdateModalOpen(false);
        setWineToUpdate(null);
        
        notifications.show({
          title: '成功',
          message: 'ワイン記録が正常に更新されました',
          color: 'green',
        });
      } else {
        setError(data.error || '更新に失敗しました');
      }
    } catch (err) {
      setError('更新中にエラーが発生しました');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateCancel = () => {
    setUpdateModalOpen(false);
    setWineToUpdate(null);
    updateForm.reset();
  };

  const handleCharacteristicsChange = (newData: typeof wineCharacteristics) => {
    setWineCharacteristics(newData);
  };

  return (
    <Box bg="gray.0" mih="100vh" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          {/* Header */}
          <Box ta="center" py="xl">
            <Title order={1} size="3.5rem" c="dark.8" mb="md">
              ワインメモ
            </Title>
            <Text size="xl" c="dimmed" maw={600} mx="auto">
              お気に入りのワインの特性を記録して、あなただけのワインライブラリを作りましょう
            </Text>
          </Box>

          {/* Feature Cards */}
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="md">
                  <IconGlass size={32} color="var(--mantine-color-purple-6)" />
                  <Title order={2} size="h3">
                    ワイン特性チャート
                  </Title>
                </Group>
                <Text c="dimmed" mb="lg">
                  甘口から辛口、軽いから重いまで、ワインの5つの特性をスライダーで評価できます。
                </Text>
                <Button 
                  component={Link}
                  href="/test"
                  color="purple"
                  leftSection={<IconGlass size={16} />}
                  fullWidth
                >
                  チャートを見る
                </Button>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="md">
                  <IconPlus size={32} color="var(--mantine-color-pink-6)" />
                  <Title order={2} size="h3">
                    ワイン記録
                  </Title>
                </Group>
                <Text c="dimmed" mb="lg">
                  飲んだワインの名前、産地、価格、感想などを記録して保存できます。
                </Text>
                <Button 
                  component={Link}
                  href="/record"
                  color="pink"
                  leftSection={<IconPlus size={16} />}
                  fullWidth
                >
                  記録を追加
                </Button>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Wine Records List */}
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Group justify="space-between" mb="lg">
              <Group>
                <IconGlass size={24} />
                <Title order={2} size="h3">
                  記録されたワイン
                </Title>
                <Badge size="lg" variant="light">
                  {wines.length}
                </Badge>
              </Group>
              <Button 
                component={Link}
                href="/record"
                color="green"
                leftSection={<IconPlus size={16} />}
                size="sm"
              >
                新しい記録
              </Button>
            </Group>

            {loading && (
              <Box ta="center" py="xl">
                <Loader size="lg" />
                <Text c="dimmed" mt="md">ワイン記録を読み込み中...</Text>
              </Box>
            )}

            {error && (
              <Alert variant="light" color="red" title="エラー" icon={<IconGlass size={16} />}>
                {error}
              </Alert>
            )}

            {!loading && !error && wines.length === 0 && (
              <Box ta="center" py="xl">
                <IconGlass size={48} color="var(--mantine-color-gray-4)" />
                <Text c="dimmed" size="lg" mt="md" mb="lg">
                  まだワイン記録がありません
                </Text>
                <Button 
                  component={Link}
                  href="/record"
                  color="purple"
                  leftSection={<IconPlus size={16} />}
                  size="lg"
                >
                  最初の記録を追加
                </Button>
              </Box>
            )}

            {!loading && !error && wines.length > 0 && (
              <Stack gap="md">
                {wines.map((wine) => (
                  <Paper key={wine.id} p="md" withBorder radius="md">
                    <Flex justify="space-between" align="flex-start" gap="md">
                      <Box flex={1}>
                        <Group mb="sm" justify="space-between">
                          <Group>
                            <Title order={3} size="h4">
                              {wine.name}
                            </Title>
                            {wine.rating && (
                              <Badge 
                                leftSection={<IconStar size={12} />}
                                variant="light"
                                color="yellow"
                              >
                                {wine.rating}/5
                              </Badge>
                            )}
                          </Group>
                          <Group gap="xs">
                            <Tooltip label="編集" withArrow>
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                size="sm"
                                onClick={() => handleUpdateClick(wine)}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="削除" withArrow>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                onClick={() => handleDeleteClick(wine)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>
                        
                        <Flex align="center" gap="lg" mb="md">
                          <WineChart 
                            characteristics={wine.characteristics}
                            width={120}
                            height={120}
                            showValues={true}
                            className="flex-shrink-0"
                          />
                          <Grid gutter="xs" style={{ flex: 1 }}>
                            <Grid.Col span={6}>
                              <Text size="sm" c="dimmed">甘口: {wine.characteristics.sweetness}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="sm" c="dimmed">軽い: {wine.characteristics.body}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="sm" c="dimmed">酸味: {wine.characteristics.acidity}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="sm" c="dimmed">渋み: {wine.characteristics.tannin}</Text>
                            </Grid.Col>
                            <Grid.Col span={12}>
                              <Text size="sm" c="dimmed">苦味: {wine.characteristics.bitterness}</Text>
                            </Grid.Col>
                          </Grid>
                        </Flex>
                        
                        {wine.notes && (
                          <Text size="sm" c="dimmed" mb="sm">
                            {wine.notes}
                          </Text>
                        )}
                        
                        <Group gap="xs">
                          {wine.region && (
                            <Badge 
                              leftSection={<IconMapPin size={12} />}
                              variant="light"
                              size="sm"
                            >
                              {wine.region}
                            </Badge>
                          )}
                          <Badge 
                            leftSection={<IconCalendar size={12} />}
                            variant="light"
                            size="sm"
                          >
                            作成: {formatDate(wine.createdAt)}
                          </Badge>
                          {wine.updatedAt && wine.updatedAt !== wine.createdAt && (
                            <Badge 
                              leftSection={<IconEdit size={12} />}
                              variant="light"
                              color="blue"
                              size="sm"
                            >
                              更新: {formatDate(wine.updatedAt)}
                            </Badge>
                          )}
                        </Group>
                      </Box>
                    </Flex>
                  </Paper>
                ))}
              </Stack>
            )}
          </Card>

          {/* Wine Characteristics Explanation */}
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Title order={2} size="h3" ta="center" mb="lg">
              ワイン特性の説明
            </Title>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Box>
                    <Title order={3} size="h5" mb="xs">甘口 ←→ 辛口（ドライ）</Title>
                    <Text size="sm" c="dimmed">
                      ワインの甘さの度合い。甘口は糖分が多く、辛口は糖分が少なくドライな味わい。
                    </Text>
                  </Box>
                  <Box>
                    <Title order={3} size="h5" mb="xs">軽い ←→ 重い（ボディ）</Title>
                    <Text size="sm" c="dimmed">
                      ワインの口当たりや重厚感。軽いワインはさっぱりとし、重いワインは濃厚で存在感がある。
                    </Text>
                  </Box>
                  <Box>
                    <Title order={3} size="h5" mb="xs">酸味が弱い ←→ 酸味が強い</Title>
                    <Text size="sm" c="dimmed">
                      ワインの酸味の強さ。適度な酸味はワインを爽やかにし、強すぎると酸っぱく感じる。
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Box>
                    <Title order={3} size="h5" mb="xs">渋みが弱い ←→ 渋みが強い（タンニン）</Title>
                    <Text size="sm" c="dimmed">
                      タンニンによる渋みの強さ。赤ワインに特徴的で、渋みはワインの構造を作る重要な要素。
                    </Text>
                  </Box>
                  <Box>
                    <Title order={3} size="h5" mb="xs">苦味が少ない ←→ 苦味がある</Title>
                    <Text size="sm" c="dimmed">
                      ワインの苦味の有無。適度な苦味は複雑さを加えるが、強すぎると飲みにくくなる。
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="ワイン記録の削除"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text>
            「<strong>{wineToDelete?.name}</strong>」を削除しますか？
          </Text>
          <Text size="sm" c="dimmed">
            この操作は取り消すことができません。
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={handleDeleteCancel}>
              キャンセル
            </Button>
            <Button 
              color="red" 
              onClick={handleDeleteConfirm}
              loading={deleting}
              leftSection={<IconTrash size={16} />}
            >
              削除
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Update Wine Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={handleUpdateCancel}
        title="ワイン記録の編集"
        centered
        size="xl"
      >
        <form onSubmit={updateForm.onSubmit(handleUpdateSubmit)}>
          <Stack gap="lg">
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <TextInput
                    label="ワイン名"
                    placeholder="例: シャトー・マルゴー 2018"
                    required
                    {...updateForm.getInputProps('wineName')}
                  />
                  
                  <Textarea
                    label="メモ"
                    placeholder="ワインの感想やメモを入力してください"
                    rows={3}
                    {...updateForm.getInputProps('notes')}
                  />

                  <NumberInput
                    label="評価"
                    placeholder="0-5の間で評価してください"
                    min={0}
                    max={5}
                    step={0.5}
                    {...updateForm.getInputProps('rating')}
                  />

                  <TextInput
                    label="産地"
                    placeholder="例: フランス・ボルドー"
                    {...updateForm.getInputProps('region')}
                  />

                  <TextInput
                    label="ヴィンテージ"
                    placeholder="例: 2018"
                    {...updateForm.getInputProps('vintage')}
                  />

                  <TextInput
                    label="ブドウ品種"
                    placeholder="例: カベルネ・ソーヴィニヨン"
                    {...updateForm.getInputProps('grapeVariety')}
                  />
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Text fw={500} size="lg">
                    ワイン特性チャート
                  </Text>
                  <Text size="sm" c="dimmed">
                    各特性をドラッグして調整してください
                  </Text>
                  
                  <Box ta="center">
                    <RadarChart
                      data={wineCharacteristics}
                      width={300}
                      height={300}
                      onDataChange={handleCharacteristicsChange}
                    />
                  </Box>
                  
                  <Text size="xs" c="dimmed" ta="center">
                    甘さ・重さ・酸味・渋み・苦味の5つの特性を評価できます
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={handleUpdateCancel}>
                キャンセル
              </Button>
              <Button 
                type="submit"
                color="blue"
                loading={updating}
                leftSection={<IconEdit size={16} />}
              >
                更新
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
