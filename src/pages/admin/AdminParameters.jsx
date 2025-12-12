import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { API_BASE_URL } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminParameters = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const customerId = 'test-customer-1';

  // Kompletní stav všech PrusaSlicer parametrů
  const [params, setParams] = useState({
    // QUALITY SETTINGS
    layer_height: { enabled: true, value: 0.2 },
    first_layer_height: { enabled: true, value: 0.2 },
    perimeters: { enabled: true, value: 3 },
    top_solid_layers: { enabled: true, value: 5 },
    bottom_solid_layers: { enabled: true, value: 4 },
    
    // INFILL
    fill_density: { enabled: true, value: 20 },
    fill_pattern: { enabled: true, value: 'cubic' },
    solid_infill_every_layers: { enabled: false, value: 0 },
    
    // SPEED
    perimeter_speed: { enabled: true, value: 50 },
    small_perimeter_speed: { enabled: false, value: 25 },
    external_perimeter_speed: { enabled: false, value: 50 },
    infill_speed: { enabled: true, value: 80 },
    solid_infill_speed: { enabled: false, value: 80 },
    top_solid_infill_speed: { enabled: false, value: 50 },
    support_material_speed: { enabled: false, value: 60 },
    support_material_interface_speed: { enabled: false, value: 100 },
    bridge_speed: { enabled: false, value: 60 },
    gap_fill_speed: { enabled: false, value: 40 },
    travel_speed: { enabled: true, value: 150 },
    first_layer_speed: { enabled: false, value: 30 },
    
    // SUPPORT
    support_material: { enabled: true, value: false },
    support_material_auto: { enabled: false, value: true },
    support_material_threshold: { enabled: false, value: 0 },
    support_material_pattern: { enabled: false, value: 'rectilinear' },
    support_material_spacing: { enabled: false, value: 2.5 },
    support_material_angle: { enabled: false, value: 0 },
    support_material_interface_layers: { enabled: false, value: 3 },
    support_material_interface_spacing: { enabled: false, value: 0 },
    support_material_buildplate_only: { enabled: false, value: false },
    support_material_xy_spacing: { enabled: false, value: 0.6 },
    
    // SKIRT AND BRIM
    skirts: { enabled: true, value: 1 },
    skirt_distance: { enabled: false, value: 6 },
    skirt_height: { enabled: false, value: 1 },
    min_skirt_length: { enabled: false, value: 0 },
    brim_width: { enabled: true, value: 0 },
    brim_type: { enabled: false, value: 'no_brim' },
    
    // RAFT
    raft_layers: { enabled: true, value: 0 },
    raft_first_layer_density: { enabled: false, value: 90 },
    raft_first_layer_expansion: { enabled: false, value: 3 },
    
    // TEMPERATURE
    temperature: { enabled: true, value: 200 },
    first_layer_temperature: { enabled: false, value: 205 },
    bed_temperature: { enabled: true, value: 60 },
    first_layer_bed_temperature: { enabled: false, value: 65 },
    
    // COOLING
    fan_always_on: { enabled: false, value: false },
    min_fan_speed: { enabled: false, value: 35 },
    max_fan_speed: { enabled: false, value: 100 },
    bridge_fan_speed: { enabled: false, value: 100 },
    disable_fan_first_layers: { enabled: false, value: 3 },
    
    // EXTRUSION
    extrusion_multiplier: { enabled: false, value: 1 },
    extrusion_width: { enabled: false, value: 0 },
    first_layer_extrusion_width: { enabled: false, value: 0 },
    perimeter_extrusion_width: { enabled: false, value: 0 },
    external_perimeter_extrusion_width: { enabled: false, value: 0 },
    infill_extrusion_width: { enabled: false, value: 0 },
    solid_infill_extrusion_width: { enabled: false, value: 0 },
    top_infill_extrusion_width: { enabled: false, value: 0 },
    support_material_extrusion_width: { enabled: false, value: 0 },
    
    // RETRACTION
    retract_length: { enabled: false, value: 0.8 },
    retract_speed: { enabled: false, value: 35 },
    retract_restart_extra: { enabled: false, value: 0 },
    retract_before_travel: { enabled: false, value: 2 },
    retract_lift: { enabled: false, value: 0 },
    retract_lift_above: { enabled: false, value: 0 },
    retract_lift_below: { enabled: false, value: 0 },
    retract_layer_change: { enabled: false, value: false },
    wipe: { enabled: false, value: false },
    
    // SEQUENTIAL PRINTING
    complete_objects: { enabled: false, value: false },
    extruder_clearance_radius: { enabled: false, value: 20 },
    extruder_clearance_height: { enabled: false, value: 20 },
    
    // ADVANCED
    resolution: { enabled: false, value: 0 },
    gcode_resolution: { enabled: false, value: 0.0125 },
    xy_size_compensation: { enabled: false, value: 0 },
    elefant_foot_compensation: { enabled: false, value: 0 },
    clip_multipart_objects: { enabled: false, value: true },
    dont_support_bridges: { enabled: false, value: true },
    
    // SEAM
    seam_position: { enabled: false, value: 'aligned' },
    external_perimeters_first: { enabled: false, value: false },
    
    // IRONING
    ironing: { enabled: false, value: false },
    ironing_type: { enabled: false, value: 'top' },
    ironing_flowrate: { enabled: false, value: 15 },
    ironing_speed: { enabled: false, value: 15 },
    ironing_spacing: { enabled: false, value: 0.1 },
  });

  const updateParam = (key, field, value) => {
    setParams(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('[AdminParameters] Saving parameters:', params);
      alert('✅ Parameters saved! (Backend integration pending)');
    } catch (error) {
      console.error('Failed to save parameters:', error);
      alert('❌ Failed to save parameters');
    } finally {
      setSaving(false);
    }
  };

  // Helper komponenta pro parametr
  const ParamField = ({ paramKey, label, type = 'number', unit = '', options = null, step = null, min = null, max = null }) => {
    const param = params[paramKey];
    
    return (
      <div className="param-field">
        <div className="param-header">
          <label className="param-label">
            <input
              type="checkbox"
              checked={param.enabled}
              onChange={(e) => updateParam(paramKey, 'enabled', e.target.checked)}
              className="param-checkbox"
            />
            <span className={!param.enabled ? 'disabled' : ''}>{label}</span>
          </label>
          <code className="param-key">{paramKey}</code>
        </div>
        <div className="param-input-wrapper">
          {type === 'select' && options ? (
            <select
              value={param.value}
              onChange={(e) => updateParam(paramKey, 'value', e.target.value)}
              disabled={!param.enabled}
              className="param-input"
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : type === 'boolean' ? (
            <select
              value={param.value.toString()}
              onChange={(e) => updateParam(paramKey, 'value', e.target.value === 'true')}
              disabled={!param.enabled}
              className="param-input"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <div className="input-with-unit">
              <input
                type={type}
                value={param.value}
                onChange={(e) => updateParam(paramKey, 'value', type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                disabled={!param.enabled}
                className="param-input"
                step={step}
                min={min}
                max={max}
              />
              {unit && <span className="unit">{unit}</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-parameters">
      <div className="page-header">
        <div>
          <h1>Slicing Parameters</h1>
          <p className="subtitle">Configure all PrusaSlicer CLI parameters</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Reset to Defaults</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="params-container">
        {/* QUALITY SETTINGS */}
        <div className="param-section">
          <h3><Icon name="Layers" size={20} /> Quality Settings</h3>
          <div className="params-grid">
            <ParamField paramKey="layer_height" label="Layer Height" unit="mm" step="0.01" min="0.05" max="0.4" />
            <ParamField paramKey="first_layer_height" label="First Layer Height" unit="mm" step="0.01" min="0.1" max="0.5" />
            <ParamField paramKey="perimeters" label="Perimeters (Walls)" step="1" min="1" max="10" />
            <ParamField paramKey="top_solid_layers" label="Top Solid Layers" step="1" min="0" max="20" />
            <ParamField paramKey="bottom_solid_layers" label="Bottom Solid Layers" step="1" min="0" max="20" />
          </div>
        </div>

        {/* INFILL */}
        <div className="param-section">
          <h3><Icon name="Grid" size={20} /> Infill</h3>
          <div className="params-grid">
            <ParamField paramKey="fill_density" label="Fill Density" unit="%" step="1" min="0" max="100" />
            <ParamField 
              paramKey="fill_pattern" 
              label="Fill Pattern" 
              type="select"
              options={[
                { value: 'rectilinear', label: 'Rectilinear' },
                { value: 'grid', label: 'Grid' },
                { value: 'triangles', label: 'Triangles' },
                { value: 'stars', label: 'Stars' },
                { value: 'cubic', label: 'Cubic' },
                { value: 'line', label: 'Line' },
                { value: 'concentric', label: 'Concentric' },
                { value: 'honeycomb', label: 'Honeycomb' },
                { value: 'gyroid', label: 'Gyroid' },
                { value: 'hilbertcurve', label: 'Hilbert Curve' },
                { value: 'archimedeanchords', label: 'Archimedean Chords' },
                { value: 'octagramspiral', label: 'Octagram Spiral' },
              ]}
            />
            <ParamField paramKey="solid_infill_every_layers" label="Solid Infill Every N Layers" step="1" min="0" max="100" />
          </div>
        </div>

        {/* SPEED */}
        <div className="param-section">
          <h3><Icon name="Gauge" size={20} /> Speed</h3>
          <div className="params-grid">
            <ParamField paramKey="perimeter_speed" label="Perimeter Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="small_perimeter_speed" label="Small Perimeter Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="external_perimeter_speed" label="External Perimeter Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="infill_speed" label="Infill Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="solid_infill_speed" label="Solid Infill Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="top_solid_infill_speed" label="Top Solid Infill Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="support_material_speed" label="Support Material Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="support_material_interface_speed" label="Support Interface Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="bridge_speed" label="Bridge Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="gap_fill_speed" label="Gap Fill Speed" unit="mm/s" step="1" min="5" max="300" />
            <ParamField paramKey="travel_speed" label="Travel Speed" unit="mm/s" step="1" min="10" max="500" />
            <ParamField paramKey="first_layer_speed" label="First Layer Speed" unit="mm/s" step="1" min="5" max="100" />
          </div>
        </div>

        {/* SUPPORT */}
        <div className="param-section">
          <h3><Icon name="Columns" size={20} /> Support Material</h3>
          <div className="params-grid">
            <ParamField paramKey="support_material" label="Generate Support Material" type="boolean" />
            <ParamField paramKey="support_material_auto" label="Auto-generated Supports" type="boolean" />
            <ParamField paramKey="support_material_threshold" label="Overhang Threshold" unit="°" step="1" min="0" max="90" />
            <ParamField 
              paramKey="support_material_pattern" 
              label="Pattern" 
              type="select"
              options={[
                { value: 'rectilinear', label: 'Rectilinear' },
                { value: 'rectilinear-grid', label: 'Rectilinear Grid' },
                { value: 'honeycomb', label: 'Honeycomb' },
              ]}
            />
            <ParamField paramKey="support_material_spacing" label="Pattern Spacing" unit="mm" step="0.1" min="0" max="10" />
            <ParamField paramKey="support_material_angle" label="Pattern Angle" unit="°" step="1" min="0" max="359" />
            <ParamField paramKey="support_material_interface_layers" label="Interface Layers" step="1" min="0" max="10" />
            <ParamField paramKey="support_material_interface_spacing" label="Interface Spacing" unit="mm" step="0.1" min="0" max="5" />
            <ParamField paramKey="support_material_buildplate_only" label="Support on Build Plate Only" type="boolean" />
            <ParamField paramKey="support_material_xy_spacing" label="XY Separation" unit="mm" step="0.1" min="0" max="5" />
          </div>
        </div>

        {/* SKIRT AND BRIM */}
        <div className="param-section">
          <h3><Icon name="Circle" size={20} /> Skirt and Brim</h3>
          <div className="params-grid">
            <ParamField paramKey="skirts" label="Skirt Loops" step="1" min="0" max="10" />
            <ParamField paramKey="skirt_distance" label="Skirt Distance from Object" unit="mm" step="0.5" min="0" max="50" />
            <ParamField paramKey="skirt_height" label="Skirt Height" unit="layers" step="1" min="1" max="100" />
            <ParamField paramKey="min_skirt_length" label="Minimum Skirt Length" unit="mm" step="1" min="0" max="1000" />
            <ParamField paramKey="brim_width" label="Brim Width" unit="mm" step="0.5" min="0" max="50" />
            <ParamField 
              paramKey="brim_type" 
              label="Brim Type" 
              type="select"
              options={[
                { value: 'no_brim', label: 'No Brim' },
                { value: 'outer_only', label: 'Outer Brim Only' },
                { value: 'inner_only', label: 'Inner Brim Only' },
                { value: 'outer_and_inner', label: 'Outer and Inner Brim' },
              ]}
            />
          </div>
        </div>

        {/* RAFT */}
        <div className="param-section">
          <h3><Icon name="Layers3" size={20} /> Raft</h3>
          <div className="params-grid">
            <ParamField paramKey="raft_layers" label="Raft Layers" step="1" min="0" max="10" />
            <ParamField paramKey="raft_first_layer_density" label="First Layer Density" unit="%" step="1" min="10" max="100" />
            <ParamField paramKey="raft_first_layer_expansion" label="First Layer Expansion" unit="mm" step="0.1" min="0" max="10" />
          </div>
        </div>

        {/* TEMPERATURE */}
        <div className="param-section">
          <h3><Icon name="Thermometer" size={20} /> Temperature</h3>
          <div className="params-grid">
            <ParamField paramKey="temperature" label="Nozzle Temperature" unit="°C" step="5" min="150" max="300" />
            <ParamField paramKey="first_layer_temperature" label="First Layer Temperature" unit="°C" step="5" min="150" max="300" />
            <ParamField paramKey="bed_temperature" label="Bed Temperature" unit="°C" step="5" min="0" max="120" />
            <ParamField paramKey="first_layer_bed_temperature" label="First Layer Bed Temperature" unit="°C" step="5" min="0" max="120" />
          </div>
        </div>

        {/* COOLING */}
        <div className="param-section">
          <h3><Icon name="Wind" size={20} /> Cooling</h3>
          <div className="params-grid">
            <ParamField paramKey="fan_always_on" label="Keep Fan Always On" type="boolean" />
            <ParamField paramKey="min_fan_speed" label="Min Fan Speed" unit="%" step="5" min="0" max="100" />
            <ParamField paramKey="max_fan_speed" label="Max Fan Speed" unit="%" step="5" min="0" max="100" />
            <ParamField paramKey="bridge_fan_speed" label="Bridge Fan Speed" unit="%" step="5" min="0" max="100" />
            <ParamField paramKey="disable_fan_first_layers" label="Disable Fan First N Layers" step="1" min="0" max="10" />
          </div>
        </div>

        {/* EXTRUSION */}
        <div className="param-section">
          <h3><Icon name="Move" size={20} /> Extrusion Width</h3>
          <div className="params-grid">
            <ParamField paramKey="extrusion_multiplier" label="Extrusion Multiplier" step="0.01" min="0.5" max="2" />
            <ParamField paramKey="extrusion_width" label="Default Extrusion Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="first_layer_extrusion_width" label="First Layer Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="perimeter_extrusion_width" label="Perimeter Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="external_perimeter_extrusion_width" label="External Perimeter Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="infill_extrusion_width" label="Infill Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="solid_infill_extrusion_width" label="Solid Infill Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="top_infill_extrusion_width" label="Top Infill Width" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="support_material_extrusion_width" label="Support Material Width" unit="mm" step="0.01" min="0" max="5" />
          </div>
        </div>

        {/* RETRACTION */}
        <div className="param-section">
          <h3><Icon name="CornerUpLeft" size={20} /> Retraction</h3>
          <div className="params-grid">
            <ParamField paramKey="retract_length" label="Length" unit="mm" step="0.1" min="0" max="10" />
            <ParamField paramKey="retract_speed" label="Speed" unit="mm/s" step="1" min="10" max="100" />
            <ParamField paramKey="retract_restart_extra" label="Extra Length on Restart" unit="mm" step="0.1" min="-5" max="5" />
            <ParamField paramKey="retract_before_travel" label="Minimum Travel After Retraction" unit="mm" step="0.1" min="0" max="10" />
            <ParamField paramKey="retract_lift" label="Z Lift" unit="mm" step="0.1" min="0" max="5" />
            <ParamField paramKey="retract_lift_above" label="Only Lift Z Above" unit="mm" step="0.1" min="0" max="100" />
            <ParamField paramKey="retract_lift_below" label="Only Lift Z Below" unit="mm" step="0.1" min="0" max="500" />
            <ParamField paramKey="retract_layer_change" label="Retract on Layer Change" type="boolean" />
            <ParamField paramKey="wipe" label="Wipe While Retracting" type="boolean" />
          </div>
        </div>

        {/* SEQUENTIAL PRINTING */}
        <div className="param-section">
          <h3><Icon name="Layers2" size={20} /> Sequential Printing</h3>
          <div className="params-grid">
            <ParamField paramKey="complete_objects" label="Complete Individual Objects" type="boolean" />
            <ParamField paramKey="extruder_clearance_radius" label="Extruder Clearance Radius" unit="mm" step="1" min="10" max="100" />
            <ParamField paramKey="extruder_clearance_height" label="Extruder Clearance Height" unit="mm" step="1" min="10" max="500" />
          </div>
        </div>

        {/* ADVANCED */}
        <div className="param-section">
          <h3><Icon name="Settings2" size={20} /> Advanced</h3>
          <div className="params-grid">
            <ParamField paramKey="resolution" label="Resolution" unit="mm" step="0.001" min="0" max="1" />
            <ParamField paramKey="gcode_resolution" label="G-code Resolution" unit="mm" step="0.001" min="0" max="1" />
            <ParamField paramKey="xy_size_compensation" label="XY Size Compensation" unit="mm" step="0.01" min="-5" max="5" />
            <ParamField paramKey="elefant_foot_compensation" label="Elephant Foot Compensation" unit="mm" step="0.01" min="0" max="5" />
            <ParamField paramKey="clip_multipart_objects" label="Clip Multipart Objects" type="boolean" />
            <ParamField paramKey="dont_support_bridges" label="Don't Support Bridges" type="boolean" />
          </div>
        </div>

        {/* SEAM */}
        <div className="param-section">
          <h3><Icon name="Crosshair" size={20} /> Seam</h3>
          <div className="params-grid">
            <ParamField 
              paramKey="seam_position" 
              label="Seam Position" 
              type="select"
              options={[
                { value: 'random', label: 'Random' },
                { value: 'nearest', label: 'Nearest' },
                { value: 'aligned', label: 'Aligned' },
                { value: 'rear', label: 'Rear' },
              ]}
            />
            <ParamField paramKey="external_perimeters_first" label="External Perimeters First" type="boolean" />
          </div>
        </div>

        {/* IRONING */}
        <div className="param-section">
          <h3><Icon name="Sparkles" size={20} /> Ironing</h3>
          <div className="params-grid">
            <ParamField paramKey="ironing" label="Enable Ironing" type="boolean" />
            <ParamField 
              paramKey="ironing_type" 
              label="Ironing Type" 
              type="select"
              options={[
                { value: 'top', label: 'Top Surfaces Only' },
                { value: 'topmost', label: 'Topmost Surface Only' },
                { value: 'solid', label: 'All Solid Layers' },
              ]}
            />
            <ParamField paramKey="ironing_flowrate" label="Flow Rate" unit="%" step="1" min="0" max="100" />
            <ParamField paramKey="ironing_speed" label="Speed" unit="mm/s" step="1" min="5" max="100" />
            <ParamField paramKey="ironing_spacing" label="Spacing" unit="mm" step="0.01" min="0.05" max="1" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-parameters {
          max-width: 1400px;
        }

        .page-header {
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2563EB;
          color: white;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1D4ED8;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #D1D5DB;
        }

        .btn-secondary:hover {
          background: #F9FAFB;
        }

        .params-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .param-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .param-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .params-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .param-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .param-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .param-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .param-label span.disabled {
          color: #9CA3AF;
        }

        .param-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .param-key {
          font-size: 11px;
          color: #6B7280;
          background: #F3F4F6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .param-input-wrapper {
          width: 100%;
        }

        .param-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
        }

        .param-input:disabled {
          background: #F9FAFB;
          color: #9CA3AF;
          cursor: not-allowed;
        }

        .param-input:focus:not(:disabled) {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-with-unit .param-input {
          flex: 1;
        }

        .unit {
          font-size: 13px;
          color: #6B7280;
          min-width: 40px;
        }

        @media (max-width: 768px) {
          .params-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminParameters;
