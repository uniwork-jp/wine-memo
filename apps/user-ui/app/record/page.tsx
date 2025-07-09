"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Button, 
  Grid, 
  Group, 
  Stack, 
  Box,
  TextInput,
  NumberInput,
  Textarea,
  Select
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { IconGlass, IconPlus } from '@tabler/icons-react';
import RadarChart from '../../components/RaderChart';

export default function RecordPage() {
  const router = useRouter();
  const [wineCharacteristics, setWineCharacteristics] = useState({
    甘口: 50,
    軽い: 50,
    酸味が弱い: 50,
    渋みが弱い: 50,
    苦味が少ない: 50,
  });

  const form = useForm({
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

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await fetch('/api/wine/create', {
        method: 'POST',
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

      const result = await response.json();

      if (response.ok) {
        notifications.show({
          title: '成功',
          message: result.message,
          color: 'green',
        });
        
        // Reset form
        form.reset();
        setWineCharacteristics({
          甘口: 50,
          軽い: 50,
          酸味が弱い: 50,
          渋みが弱い: 50,
          苦味が少ない: 50,
        });

        // Redirect to top page after successful submission
        setTimeout(() => {
          router.push('/');
        }, 1500); // Wait 1.5 seconds to show the success notification
      } else {
        notifications.show({
          title: 'エラー',
          message: result.error || 'ワイン記録の保存に失敗しました',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      notifications.show({
        title: 'エラー',
        message: 'ネットワークエラーが発生しました',
        color: 'red',
      });
    }
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
              ワイン記録
            </Title>
            <Text size="xl" c="dimmed" maw={600} mx="auto">
              新しいワインの特性を記録して、あなたのワインライブラリに追加しましょう
            </Text>
          </Box>

          {/* Record Form */}
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="lg">
                <Grid gutter="lg">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="md">
                      <TextInput
                        label="ワイン名"
                        placeholder="例: シャトー・マルゴー 2018"
                        required
                        {...form.getInputProps('wineName')}
                      />
                      
                      <Textarea
                        label="メモ"
                        placeholder="ワインの感想やメモを入力してください"
                        rows={3}
                        {...form.getInputProps('notes')}
                      />

                      <NumberInput
                        label="評価"
                        placeholder="0-5の間で評価してください"
                        min={0}
                        max={5}
                        step={0.5}
                        {...form.getInputProps('rating')}
                      />

                      <TextInput
                        label="産地"
                        placeholder="例: フランス・ボルドー"
                        {...form.getInputProps('region')}
                      />

                      <TextInput
                        label="ヴィンテージ"
                        placeholder="例: 2018"
                        {...form.getInputProps('vintage')}
                      />

                      <TextInput
                        label="ブドウ品種"
                        placeholder="例: カベルネ・ソーヴィニヨン"
                        {...form.getInputProps('grapeVariety')}
                      />
                    </Stack>
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="md">
                      <Group>
                        <IconGlass size={24} color="var(--mantine-color-purple-6)" />
                        <Title order={2} size="h3">
                          ワイン特性チャート
                        </Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        各特性をドラッグして調整してください
                      </Text>
                      
                      <Box ta="center">
                        <RadarChart
                          data={wineCharacteristics}
                          width={350}
                          height={350}
                          onDataChange={handleCharacteristicsChange}
                        />
                      </Box>
                      
                      <Text size="xs" c="dimmed" ta="center">
                        甘さ・重さ・酸味・渋み・苦味の5つの特性を評価できます
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
                
                <Group justify="center" mt="xl">
                  <Button 
                    type="submit" 
                    size="lg"
                    color="purple"
                    leftSection={<IconPlus size={16} />}
                  >
                    記録を保存
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
