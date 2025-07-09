import React from 'react';
import Link from 'next/link';

export default function Home() {
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
