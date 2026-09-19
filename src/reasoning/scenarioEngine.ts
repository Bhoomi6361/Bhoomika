import { EnvironmentalInput, ScenarioSimulation, InterventionDirection } from '../types/environmental';

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  interventions: string[];
}

export const PRESET_INTERVENTIONS: ScenarioPreset[] = [
  {
    id: 'agro-regenerative',
    name: 'Holistic Agro-Regenerative Package',
    description: 'Multi-species cover crops + crop diversification + native vegetation strips',
    interventions: ['Legume-based Cover Crops', 'Crop Diversification / Strip Intercropping', 'Native Flowering Vegetation Strips']
  },
  {
    id: 'silvo-windbreak',
    name: 'Dryland Agroforestry & Microclimate Shelter',
    description: 'Drought-hardy tree windbreaks + residue mulch retention',
    interventions: ['Agroforestry Tree Windbreaks (Perennial Legumes)', 'No-till Surface Residue Retention']
  },
  {
    id: 'pollinator-corridor',
    name: 'Landscape Rewilding & Pollinator Corridors',
    description: '5-8% perimeter flowering buffers + beetle banks + reduced chemical inputs',
    interventions: ['Native Flowering Buffers (5-8% field edge)', 'Beetle Banks & Non-inversion Tillage', 'Pesticide Threshold Reduction']
  }
];

export function runScenarioSimulation(
  current: EnvironmentalInput,
  interventions: string[]
): ScenarioSimulation {
  const affectedVars: string[] = [];
  const directions: InterventionDirection[] = [];

  const hasCoverCrops = interventions.some(i => i.toLowerCase().includes('cover crop'));
  const hasDiversification = interventions.some(i => i.toLowerCase().includes('diversification') || i.toLowerCase().includes('intercrop'));
  const hasStrips = interventions.some(i => i.toLowerCase().includes('strip') || i.toLowerCase().includes('native') || i.toLowerCase().includes('buffer'));
  const hasAgroforestry = interventions.some(i => i.toLowerCase().includes('agroforestry') || i.toLowerCase().includes('tree'));
  const hasNoTill = interventions.some(i => i.toLowerCase().includes('no-till') || i.toLowerCase().includes('residue'));

  // 1. Soil Organic Carbon
  if (hasCoverCrops || hasNoTill || hasAgroforestry) {
    affectedVars.push('Soil Organic Carbon (%)');
    directions.push({
      metric: 'Soil Organic Carbon (%)',
      direction: 'Increase',
      shortTerm: 'Root exudates stimulate microbial respiration; labile active carbon fraction rises within 12-18 months.',
      mediumTerm: 'Continuous organic carbon inputs stabilize into mineral-associated organic matter (MAOM) (+0.3 to 0.5 Mg C/ha/yr).',
      longTerm: 'Topsoil organic carbon pool approaches equilibrium (+0.8% to +1.4% absolute gain over baseline in 6-10 years).',
      confidence: 'High'
    });
  }

  // 2. Soil Moisture & Available Water Capacity
  if (hasCoverCrops || hasAgroforestry || hasNoTill) {
    affectedVars.push('Soil Moisture & Infiltration');
    directions.push({
      metric: 'Soil Moisture & Infiltration',
      direction: 'Increase',
      shortTerm: 'Surface residue cover shields topsoil against rapid solar evaporation; rainfall infiltration improves.',
      mediumTerm: 'Expanded soil aggregation increases plant-available water capacity by 1.5-3.0% volumetric moisture per 1% SOC.',
      longTerm: 'Enhanced groundwater recharge rate; plants withstand prolonged inter-storm dry periods with significantly lower wilt rates.',
      confidence: 'High'
    });
  }

  // 3. Habitat Diversity
  if (hasStrips || hasAgroforestry || hasDiversification) {
    affectedVars.push('Habitat Diversity & Structural Complexity');
    directions.push({
      metric: 'Habitat Diversity & Structural Complexity',
      direction: 'Increase',
      shortTerm: 'Field border strips provide immediate flowering resources and physical shelter from field cultivation.',
      mediumTerm: 'Multi-layered canopies and herbaceous roots create diverse subterranean and aerial ecological niches.',
      longTerm: 'Reconnection of fragmented agricultural landscape, establishing permanent wildlife movement corridors.',
      confidence: 'High'
    });
  }

  // 4. Invertebrate & Pollinator Richness
  if (hasStrips || hasDiversification) {
    affectedVars.push('Species Richness (Pollinators & Beneficials)');
    directions.push({
      metric: 'Species Richness (Invertebrates & Pollinators)',
      direction: 'Increase',
      shortTerm: 'Foraging solitary bees and hoverflies colonize perimeter floral resources within the first flowering cycle.',
      mediumTerm: 'Overwintering survival of ground predatory beetles multiplies, establishing resident biocontrol populations.',
      longTerm: 'Stable, multi-trophic insect and avian biodiversity network with minimal vulnerability to pest outbreaks.',
      confidence: 'High'
    });
  }

  // 5. Climate / Thermal Stress
  if (hasAgroforestry || hasCoverCrops) {
    affectedVars.push('Microclimate Thermal Stress');
    directions.push({
      metric: 'Canopy & Surface Temperature',
      direction: 'Decrease',
      shortTerm: 'Surface mulching suppresses extreme topsoil temperature peaks during high-radiation summer days.',
      mediumTerm: 'Agroforestry windbreaks reduce ground wind velocity and lower canopy heat by 2-4°C.',
      longTerm: 'Permanent microclimatic dampening cushions vulnerable crops and native understory from extreme thermal anomalies.',
      confidence: 'Medium'
    });
  }

  const soilImplications = hasCoverCrops || hasNoTill
    ? 'Soil aggregate stability increases through fungal hyphal binding and glomalin production. Biological pore continuity protects against compaction, and erosion loss drops by 60-80%.'
    : 'Moderate stabilization of physical soil structure through root reinforcement.';

  const waterImplications = hasCoverCrops || hasAgroforestry
    ? 'Available Water Capacity (AWC) expands systematically. Tree canopies reduce evapotranspiration demands, and soil residue prevents capillary water loss during high-heat periods.'
    : 'Minor improvements in rain infiltration; water retention remains constrained if soil carbon is not replenished.';

  const biodiversityImplications = hasStrips || hasDiversification
    ? 'Trophic cascade recovery: non-crop flowering plants support parasitoid wasps, syrphid flies, and wild native bees, replacing chemical dependency with natural pest suppression.'
    : 'Local invertebrate presence increases around cultivated zones; full avian and mammalian movement requires landscape-scale connectivity.';

  const habitatImplications = hasAgroforestry || hasStrips
    ? 'Replaces homogenous monoculture with three-dimensional landscape complexity: deep root networks, herbaceous groundcover, and woody perennial tiers.'
    : 'Enhanced field-level microhabitats with minimal architectural change to the wider landscape.';

  const evidence = [
    {
      source: 'FAO Global Soil Partnership',
      study: 'Technical Report on Recarbonizing Global Soils (2020)',
      year: 2020,
      url: 'https://www.fao.org/global-soil-partnership/resources/en/'
    },
    {
      source: 'IPCC SRCCL',
      study: 'Special Report on Climate Change and Land, Chapter 5 (2019)',
      year: 2019,
      url: 'https://www.ipcc.ch/srccl/'
    },
    {
      source: 'IUCN Nature-Based Solutions',
      study: 'Global Standard for Nature-based Solutions (2020)',
      year: 2020,
      url: 'https://www.iucn.org/our-work/nature-based-solutions'
    }
  ];

  return {
    id: `SCENARIO-${Date.now()}`,
    title: `Simulation: ${interventions.slice(0, 2).join(' + ')}`,
    timestamp: new Date().toISOString(),
    currentCondition: current,
    proposedInterventions: interventions,
    affectedVariables: affectedVars,
    directionOfChange: directions,
    soilImplications,
    waterImplications,
    biodiversityImplications,
    habitatImplications,
    evidence,
    confidence: 'High'
  };
}
