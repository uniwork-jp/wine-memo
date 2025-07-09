'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WineChart } from '../components';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ワインメモ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            お気に入りのワインの特性を記録して、あなただけのワインライブラリを作りましょう
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ワイン特性チャート
              </h2>
              <p className="text-gray-600 mb-4">
                甘口から辛口、軽いから重いまで、ワインの5つの特性をスライダーで評価できます。
              </p>
              <Link 
                href="/test"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                チャートを見る
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ワイン記録
              </h2>
              <p className="text-gray-600 mb-4">
                飲んだワインの名前、産地、価格、感想などを記録して保存できます。
              </p>
              <Link 
                href="/record"
                className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                記録を追加
              </Link>
            </div>
          </div>

          {/* Wine Records List */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                記録されたワイン ({wines.length})
              </h2>
              <Link 
                href="/record"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                新しい記録
              </Link>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">ワイン記録を読み込み中...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && wines.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">まだワイン記録がありません</p>
                <Link 
                  href="/record"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  最初の記録を追加
                </Link>
              </div>
            )}

            {!loading && !error && wines.length > 0 && (
              <div className="grid gap-4">
                {wines.map((wine) => (
                  <div key={wine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{wine.name}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <WineChart 
                            characteristics={wine.characteristics}
                            width={120}
                            height={120}
                            showValues={true}
                            className="flex-shrink-0"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-600">
                            <div>甘口: {wine.characteristics.sweetness}</div>
                            <div>軽い: {wine.characteristics.body}</div>
                            <div>酸味: {wine.characteristics.acidity}</div>
                            <div>渋み: {wine.characteristics.tannin}</div>
                            <div>苦味: {wine.characteristics.bitterness}</div>
                          </div>
                        </div>
                        {wine.notes && (
                          <p className="text-gray-600 text-sm mb-2">{wine.notes}</p>
                        )}
                        {wine.region && (
                          <p className="text-gray-500 text-xs">産地: {wine.region}</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500 ml-4">
                        <div>{formatDate(wine.createdAt)}</div>
                        {wine.rating && (
                          <div className="mt-1">
                            <span className="text-yellow-500">★</span> {wine.rating}/5
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ワイン特性の説明
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">甘口 ←→ 辛口（ドライ）</h3>
                <p className="text-gray-600 text-sm">
                  ワインの甘さの度合い。甘口は糖分が多く、辛口は糖分が少なくドライな味わい。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">軽い ←→ 重い（ボディ）</h3>
                <p className="text-gray-600 text-sm">
                  ワインの口当たりや重厚感。軽いワインはさっぱりとし、重いワインは濃厚で存在感がある。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">酸味が弱い ←→ 酸味が強い</h3>
                <p className="text-gray-600 text-sm">
                  ワインの酸味の強さ。適度な酸味はワインを爽やかにし、強すぎると酸っぱく感じる。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">渋みが弱い ←→ 渋みが強い（タンニン）</h3>
                <p className="text-gray-600 text-sm">
                  タンニンによる渋みの強さ。赤ワインに特徴的で、渋みはワインの構造を作る重要な要素。
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">苦味が少ない ←→ 苦味がある</h3>
                <p className="text-gray-600 text-sm">
                  ワインの苦味の有無。適度な苦味は複雑さを加えるが、強すぎると飲みにくくなる。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
