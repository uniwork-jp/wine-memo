"use client";

import React, { useState } from 'react';
import { TextInput, Container, Title, Paper, Stack, Button, Grid, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import RadarChart from '@/components/RaderChart';

export default function RecordPage() {
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
    },
    validate: {
      wineName: (value) => (value.length < 2 ? 'ワイン名は2文字以上で入力してください' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Wine name:', values.wineName);
    console.log('Wine characteristics:', wineCharacteristics);
    // TODO: Add wine record logic here
  };

  const handleCharacteristicsChange = (newData: typeof wineCharacteristics) => {
    setWineCharacteristics(newData);
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={1} mb="lg" ta="center">
          ワイン記録
        </Title>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <TextInput
                  label="ワイン名"
                  placeholder="例: シャトー・マルゴー 2018"
                  required
                  {...form.getInputProps('wineName')}
                />
                
                <Text size="sm" c="dimmed" mt="xs">
                  ワイン名を入力してください
                </Text>
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
                
                <div className="flex justify-center">
                  <RadarChart
                    data={wineCharacteristics}
                    width={350}
                    height={350}
                    onDataChange={handleCharacteristicsChange}
                  />
                </div>
                
                <Text size="xs" c="dimmed" ta="center">
                  甘さ・重さ・酸味・渋み・苦味の5つの特性を評価できます
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
          
          <Stack gap="md" mt="xl">
            <Button type="submit" fullWidth size="lg">
              記録を保存
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
